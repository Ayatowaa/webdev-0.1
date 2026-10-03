"use client";
import { useCart } from "../store-provider";
import { products, money } from "@/lib/catalog";
export default function Cart() {
  const { items, loading, error, total, update, mutating, refresh } = useCart();
  return (
    <main id="main" className="wrap">
      <nav className="shop-breadcrumb">
        <a href="/demos/form#catalog">Continue exploring</a>
      </nav>
      <h1 className="shop-page-title">Your considered collection.</h1>
      {error && (
        <p role="alert" className="error-message">
          {error}{" "}
          <button className="text-button" onClick={() => void refresh()}>
            Retry
          </button>
        </p>
      )}
      {loading ? (
        <p className="loading-message" role="status">
          Loading your bag…
        </p>
      ) : !items.length ? (
        <div className="empty-state">
          <h2>Your bag is waiting.</h2>
          <p>Find an everyday object that speaks to you.</p>
          <a
            className="button dark-button"
            href="/demos/form#catalog"
            style={{ marginTop: 25 }}
          >
            Explore the collection
          </a>
        </div>
      ) : (
        <div className="cart-layout">
          <section aria-label="Bag items">
            {items.map((item) => {
              const p = products.find((p) => p.id === item.productId)!;
              return (
                <article className="cart-item" key={p.id}>
                  <a href={`/demos/form/product/${p.slug}`}>
                    <img
                      src={`/images/${p.image}.webp`}
                      alt={p.name}
                      width="105"
                      height="115"
                    />
                  </a>
                  <div className="cart-item-info">
                    <h2>
                      <a href={`/demos/form/product/${p.slug}`}>{p.name}</a>
                    </h2>
                    <p>{money(p.price)} each</p>
                    <button
                      className="text-button"
                      disabled={mutating}
                      onClick={() =>
                        void update(p.id, 0, "set").catch(() => {})
                      }
                      aria-label={`Remove ${p.name}`}
                    >
                      Remove
                    </button>
                    <div className="quantity-control">
                      <button
                        aria-label={`Decrease ${p.name} quantity`}
                        disabled={mutating || item.quantity <= 1}
                        onClick={() =>
                          void update(p.id, item.quantity - 1, "set").catch(
                            () => {},
                          )
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        aria-label={`Increase ${p.name} quantity`}
                        disabled={mutating || item.quantity >= p.stock}
                        onClick={() =>
                          void update(p.id, item.quantity + 1, "set").catch(
                            () => {},
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <strong style={{ fontSize: 15 }}>
                    {money(p.price * item.quantity)}
                  </strong>
                </article>
              );
            })}
          </section>
          <aside className="order-summary">
            <h2>Order summary</h2>
            <div className="summary-line">
              <span>Subtotal</span>
              <span>{money(total)}</span>
            </div>
            <div className="summary-line">
              <span>Delivery & tax</span>
              <span>Not charged</span>
            </div>
            <div className="summary-line total">
              <span>Demo total</span>
              <span>{money(total)}</span>
            </div>
            <a className="button dark-button" href="/demos/form/checkout">
              Continue to demo checkout
            </a>
            <p>
              This is a demonstration. You will not be charged, and nothing will
              be shipped.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
