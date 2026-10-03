"use client";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./store-provider";
export function StoreHeader() {
  const { count } = useCart();
  return (
    <header className="demo-nav wrap">
      <a className="demo-brand" href="/demos/form">
        form supply
      </a>
      <nav aria-label="Store navigation">
        <a href="/demos/form#catalog">The collection</a>
        <a className="cart-link" href="/demos/form/cart">
          <ShoppingBag size={18} />
          <span>Bag ({count})</span>
        </a>
      </nav>
    </header>
  );
}
