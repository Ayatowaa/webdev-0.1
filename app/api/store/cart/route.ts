import { database } from "@/db/raw";
import { body, fail, HttpError, json } from "@/lib/http";
import { products, cartTotal } from "@/lib/catalog";
import { session, readCart } from "@/lib/store-server";
export async function GET() {
  try {
    const s = await session();
    const items = await readCart(s.id);
    return json({ items, total: cartTotal(items) });
  } catch (e) {
    return fail(e);
  }
}
export async function POST(request: Request) {
  try {
    const data = await body(request);
    const p = products.find((p) => p.id === data.productId);
    if (
      !p ||
      !Number.isInteger(data.quantity) ||
      data.quantity < 0 ||
      data.quantity > p.stock ||
      !["set", "add"].includes(data.mode)
    )
      throw new HttpError(400, "Choose a valid product and quantity.");
    const s = await session(true);
    const db = database();
    const now = Date.now();
    if (data.mode === "set" && data.quantity === 0) {
      await db
        .prepare("DELETE FROM cart_items WHERE session_id=? AND product_id=?")
        .bind(s.id, p.id)
        .run();
    } else if (data.mode === "add") {
      if (data.quantity < 1)
        throw new HttpError(400, "Quantity must be at least one.");
      const result = await db
        .prepare(
          "INSERT INTO cart_items(session_id,product_id,quantity,updated_at) VALUES(?,?,?,?) ON CONFLICT(session_id,product_id) DO UPDATE SET quantity=CASE WHEN cart_items.updated_at < ? THEN excluded.quantity ELSE cart_items.quantity + excluded.quantity END, updated_at=excluded.updated_at WHERE (CASE WHEN cart_items.updated_at < ? THEN 0 ELSE cart_items.quantity END) + excluded.quantity <= ?",
        )
        .bind(
          s.id,
          p.id,
          data.quantity,
          now,
          now - 30 * 86400000,
          now - 30 * 86400000,
          p.stock,
        )
        .run();
      if (!result.meta.changes)
        throw new HttpError(409, "The available stock limit has been reached.");
    } else {
      await db
        .prepare(
          "INSERT INTO cart_items(session_id,product_id,quantity,updated_at) VALUES(?,?,?,?) ON CONFLICT(session_id,product_id) DO UPDATE SET quantity=excluded.quantity,updated_at=excluded.updated_at",
        )
        .bind(s.id, p.id, data.quantity, now)
        .run();
    }
    const items = await readCart(s.id);
    return json(
      { items, total: cartTotal(items) },
      200,
      s.cookie ? { "Set-Cookie": s.cookie } : {},
    );
  } catch (e) {
    return fail(e);
  }
}
