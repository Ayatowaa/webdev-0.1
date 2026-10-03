"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { readResponse, cartResponse } from "@/lib/api-client";
import { type CartLine, cartTotal } from "@/lib/catalog";
type CartState = {
  items: CartLine[];
  loading: boolean;
  error: string;
  mutating: boolean;
  refresh: () => Promise<void>;
  update: (
    productId: string,
    quantity: number,
    mode: "set" | "add",
  ) => Promise<void>;
};
const Context = createContext<CartState | null>(null);
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mutating, setMutating] = useState(false);
  const refresh = useCallback(async () => {
    setError("");
    try {
      const r = await fetch("/api/store/cart");
      const d = await readResponse(r, cartResponse);
      setItems(d.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cart unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  async function update(
    productId: string,
    quantity: number,
    mode: "set" | "add",
  ) {
    setMutating(true);
    setError("");
    try {
      const r = await fetch("/api/store/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, mode }),
      });
      const d = await readResponse(r, cartResponse);
      setItems(d.items);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not update cart.";
      setError(message);
      throw e;
    } finally {
      setMutating(false);
    }
  }
  return (
    <Context.Provider
      value={{ items, loading, error, mutating, refresh, update }}
    >
      {children}
    </Context.Provider>
  );
}
export function useCart() {
  const c = useContext(Context);
  if (!c) throw new Error("Store provider required");
  return {
    ...c,
    total: cartTotal(c.items),
    count: c.items.reduce((n, i) => n + i.quantity, 0),
  };
}
