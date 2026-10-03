"use client";
import { randomId } from "@/lib/client-id";
import { useRef, useState } from "react";
import { readResponse, orderResponse } from "@/lib/api-client";
import { CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "../store-provider";
import { products, money } from "@/lib/catalog";
export default function Checkout() {
  const { items, total, loading, error: cartError, refresh } = useCart();
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<{ id: string; total: number } | null>(
    null,
  );
  const key = useRef<string>("");
  async function checkout() {
    if (!accepted || busy) return;
    setBusy(true);
    setError("");
    try {
      key.current ||= randomId();
      const r = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulationAccepted: true,
          idempotencyKey: key.current,
        }),
      });
      const d = await readResponse(r, orderResponse);
      setOrder(d.order);
      await refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not complete the demo order.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (order)
    return (
      <main id="main" className="wrap">
        <section className="checkout-success">
          <CheckCircle2 size={45} />
          <p className="eyebrow" style={{ marginTop: 20 }}>
            SIMULATION COMPLETE
          </p>
          <h1>A little everyday good.</h1>
          <p>
            Your demo order has been recorded. No payment was taken, and no
            items will be shipped.
          </p>
          <p>
            Reference: {order.id.slice(0, 8).toUpperCase()}
            <br />
            Demo total: {money(order.total)}
          </p>
          <a className="button dark-button" href="/demos/form">
            Back to the collection
          </a>
        </section>
      </main>
    );
  return (
    <main id="main" className="wrap">
      <nav className="shop-breadcrumb">
        <a href="/demos/form/cart">Back to bag</a>
      </nav>
      <h1 className="shop-page-title">A checkout, without the charge.</h1>
      {loading ? (
        <p role="status" className="loading-message">
          Loading your bag…
        </p>
      ) : !items.length ? (
        <div className="empty-state">
          <h2>Your bag is empty.</h2>
          <a className="button dark-button" href="/demos/form">
            Explore the collection
          </a>
        </div>
      ) : (
        <div className="cart-layout">
          <section>
            <div className="checkout-notice">
              <h2>Just a demonstration.</h2>
              <p>
                This flow validates your cart and saves a simulated order. It
                does not collect your address or payment details, process a
                charge, or create a real purchase.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "start", gap: 12 }}>
              <Checkbox
                id="simulation-accept"
                checked={accepted}
                onCheckedChange={(v) => setAccepted(v === true)}
                className="mt-1"
              />
              <label htmlFor="simulation-accept" style={{ fontSize: 15 }}>
                I understand this is a simulated order, with no payment or
                delivery.
              </label>
            </div>
            {(error || cartError) && (
              <p
                role="alert"
                className="error-message"
                style={{ marginTop: 20 }}
              >
                {error || cartError}
              </p>
            )}
          </section>
          <aside className="order-summary">
            <h2>Review your objects</h2>
            {items.map((i) => (
              <div className="summary-line" key={i.productId}>
                <span>
                  {products.find((p) => p.id === i.productId)!.name} ×{" "}
                  {i.quantity}
                </span>
                <span>
                  {money(
                    products.find((p) => p.id === i.productId)!.price *
                      i.quantity,
                  )}
                </span>
              </div>
            ))}
            <div className="summary-line total">
              <span>Demo total</span>
              <span>{money(total)}</span>
            </div>
            <button
              className="button dark-button"
              disabled={!accepted || busy}
              onClick={() => void checkout()}
            >
              {busy ? "Recording demo order…" : "Place simulated order"}
            </button>
            <p>Amounts are calculated on the server using the demo catalog.</p>
          </aside>
        </div>
      )}
    </main>
  );
}
