import { notFound } from "next/navigation";
import { products, getProduct, money } from "@/lib/catalog";
import { AddToBag } from "./product-actions";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = getProduct((await params).slug);
  return {
    title: p ? `${p.name} — Form Supply` : "Product not found",
    description: p?.description,
  };
}
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  return (
    <main id="main" className="wrap">
      <nav className="shop-breadcrumb" aria-label="Breadcrumb">
        <a href="/demos/form#catalog">Collection</a>
        <span>/</span>
        <span>{p.name}</span>
      </nav>
      <section className="product-detail">
        <img
          src={`/images/${p.image}.webp`}
          alt={p.name + " — illustrative photograph"}
          width="800"
          height="800"
          fetchPriority="high"
        />
        <div className="product-detail-copy">
          <p className="eyebrow">{p.category} / DEMO PRODUCT</p>
          <h1>{p.name}</h1>
          <p className="product-price">{money(p.price)}</p>
          <p className="product-description">{p.description}</p>
          <AddToBag product={p} />
          <ul className="product-specs">
            {p.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p style={{ fontSize: 12, color: "#657260", marginTop: 18 }}>
            Fictional listing. No purchase, payment or shipment takes place.
          </p>
        </div>
      </section>
    </main>
  );
}
