import { database } from "@/db/raw";
import { body, fail, HttpError, json } from "@/lib/http";
import { cartTotal } from "@/lib/catalog";
import { session, readCart } from "@/lib/store-server";
export async function POST(request: Request) {
  try {
    const data = await body(request);
    if (
      data.simulationAccepted !== true ||
      typeof data.idempotencyKey !== "string" ||
      !/^[a-f0-9-]{36}$/.test(data.idempotencyKey)
    )
      throw new HttpError(
        400,
        "Confirm the simulated checkout before continuing.",
      );
    const s = await session();
    if (!s.id) throw new HttpError(400, "Your cart is empty.");
    const db = database();
    const key = s.id + ":" + data.idempotencyKey;
    const old = await db
      .prepare(
        "SELECT id,total,items_json AS itemsJson FROM demo_orders WHERE idempotency_key=? AND session_id=?",
      )
      .bind(key, s.id)
      .first<{ id: string; total: number; itemsJson: string }>();
    if (old)
      return json({
        order: {
          id: old.id,
          total: old.total,
          items: JSON.parse(old.itemsJson),
        },
        simulated: true,
      });
    const items = await readCart(s.id);
    if (!items.length) throw new HttpError(400, "Your cart is empty.");
    const total = cartTotal(items);
    const id = crypto.randomUUID();
    const now = Date.now();
    await db.batch([
      db
        .prepare(
          "INSERT OR IGNORE INTO demo_orders(id,session_id,idempotency_key,total,items_json,created_at) VALUES(?,?,?,?,?,?)",
        )
        .bind(id, s.id, key, total, JSON.stringify(items), now),
      ...items.map((item) =>
        db
          .prepare(
            "DELETE FROM cart_items WHERE session_id=? AND product_id=? AND quantity=? AND updated_at<=? AND EXISTS(SELECT 1 FROM demo_orders WHERE id=?)",
          )
          .bind(s.id, item.productId, item.quantity, now, id),
      ),
    ]);
    const saved = await db
      .prepare(
        "SELECT id,total,items_json AS itemsJson FROM demo_orders WHERE idempotency_key=? AND session_id=?",
      )
      .bind(key, s.id)
      .first<{ id: string; total: number; itemsJson: string }>();
    if (!saved) throw new Error("Order not saved");
    return json(
      {
        order: {
          id: saved.id,
          total: saved.total,
          items: JSON.parse(saved.itemsJson),
        },
        simulated: true,
      },
      201,
    );
  } catch (e) {
    return fail(e);
  }
}
