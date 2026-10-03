import { cookies } from "next/headers";
import { database } from "@/db/raw";
import type { CartLine } from "./catalog";
export async function session(create = false) {
  const jar = await cookies();
  const existing = jar.get("form_cart")?.value;
  if (existing && /^[a-f0-9-]{36}$/.test(existing))
    return { id: existing, cookie: undefined };
  if (!create) return { id: null, cookie: undefined };
  const id = crypto.randomUUID();
  return {
    id,
    cookie: `form_cart=${id}; Path=/; HttpOnly; ${process.env.NODE_ENV === "development" ? "" : "Secure; "}SameSite=Lax; Max-Age=2592000`,
  };
}
export async function readCart(id: string | null) {
  if (!id) return [];
  return (
    await database()
      .prepare(
        "SELECT product_id AS productId, quantity FROM cart_items WHERE session_id=? AND updated_at>?",
      )
      .bind(id, Date.now() - 30 * 86400000)
      .all<CartLine>()
  ).results;
}
