export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Workspace" | "Everyday" | "Accessories";
  price: number;
  image: string;
  description: string;
  details: string[];
  stock: number;
};
export const products: Product[] = [
  {
    id: "lamp",
    slug: "arc-desk-lamp",
    name: "Arc desk lamp",
    category: "Workspace",
    price: 8900,
    image: "lamp",
    description:
      "A sculptural light for a considered workspace. This fictional product pairs a warm metallic finish with a simple, expressive silhouette.",
    details: [
      "Illustrative finish: brushed brass",
      "Designed for desk and bedside settings",
      "Concept product · not available for purchase",
    ],
    stock: 8,
  },
  {
    id: "headphones",
    slug: "quiet-headphones",
    name: "Quiet headphones",
    category: "Everyday",
    price: 12900,
    image: "headphones",
    description:
      "A minimal companion for focused days and slower moments. An illustrative audio product for this storefront demonstration.",
    details: [
      "Illustrative finish: matte black",
      "Over-ear form factor",
      "Concept specifications · no real product warranty",
    ],
    stock: 12,
  },
  {
    id: "mug",
    slug: "daily-ceramic-mug",
    name: "Daily ceramic mug",
    category: "Everyday",
    price: 2800,
    image: "mug",
    description:
      "A tactile everyday object, made for the small pause between bigger things. A ceramic-inspired concept with a simple profile.",
    details: [
      "Illustrative material: glazed ceramic",
      "Neutral palette",
      "Concept product · no real shipment",
    ],
    stock: 20,
  },
  {
    id: "notebook",
    slug: "field-notebook",
    name: "Field notebook",
    category: "Workspace",
    price: 1800,
    image: "notebook",
    description:
      "A place for thoughts, sketches and the beginnings of something new. This fictional stationery concept keeps the essentials close.",
    details: [
      "Illustrative cover: paperboard",
      "Ruled concept pages",
      "Photo is illustrative; design details may vary",
    ],
    stock: 25,
  },
  {
    id: "backpack",
    slug: "daypack",
    name: "Everyday daypack",
    category: "Accessories",
    price: 7400,
    image: "backpack",
    description:
      "A practical silhouette for the things you carry every day. A fictional catalog entry illustrated with independent product photography.",
    details: [
      "Illustrative color: charcoal",
      "Everyday carry concept",
      "Branding visible in photography belongs to its owner",
    ],
    stock: 9,
  },
  {
    id: "watch",
    slug: "essential-watch",
    name: "Essential watch",
    category: "Accessories",
    price: 11500,
    image: "watch",
    description:
      "An understated approach to keeping time. An illustrative watch entry, presented as part of a simulated shopping experience.",
    details: [
      "Illustrative dial: minimal white",
      "Concept accessory · no claimed manufacturer affiliation",
      "Branding visible in photography belongs to its owner",
    ],
    stock: 6,
  },
];
export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
export function cartTotal(items: { productId: string; quantity: number }[]) {
  return items.reduce((sum, item) => {
    const p = products.find((p) => p.id === item.productId);
    if (
      !p ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > p.stock
    )
      throw new Error("Invalid cart");
    return sum + p.price * item.quantity;
  }, 0);
}
export type CartLine = { productId: string; quantity: number };
