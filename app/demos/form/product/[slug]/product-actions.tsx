"use client";
import { useState } from "react";
import { useCart } from "../../store-provider";
import type { Product } from "@/lib/catalog";
export function AddToBag({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { update, error, mutating, loading } = useCart();
  return (
    <div>
      <div className="quantity-control" aria-label="Quantity">
        <button
          disabled={quantity <= 1 || mutating}
          aria-label="Decrease quantity"
          onClick={() => setQuantity((q) => q - 1)}
        >
          −
        </button>
        <span aria-live="polite">{quantity}</span>
        <button
          disabled={quantity >= product.stock || mutating}
          aria-label="Increase quantity"
          onClick={() => setQuantity((q) => q + 1)}
        >
          +
        </button>
      </div>
      <button
        className="button dark-button"
        disabled={mutating || loading}
        onClick={async () => {
          setAdded(false);
          try {
            await update(product.id, quantity, "add");
            setAdded(true);
          } catch {}
        }}
      >
        {mutating ? "Adding…" : "Add to bag"}
      </button>
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
      {added && (
        <p role="status" className="feedback">
          Added to your bag.{" "}
          <a href="/demos/form/cart" style={{ textDecoration: "underline" }}>
            View bag
          </a>
        </p>
      )}
    </div>
  );
}
