"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { products, money } from "@/lib/catalog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useWebTool } from "@/lib/webmcp";
export function Catalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const filtered = products
    .filter(
      (p) =>
        (category === "All" || p.category === category) &&
        `${p.name} ${p.description}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : 0,
    );
  useWebTool(
    useMemo(
      () => ({
        name: "search_store_catalog",
        description:
          "Search the fictional store catalog and update the visible search results. Does not add items to the bag.",
        inputSchema: {
          type: "object",
          properties: { query: { type: "string", maxLength: 100 } },
          required: ["query"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: async (input: unknown) => {
          const x = input as { query?: unknown };
          if (
            !x ||
            typeof x.query !== "string" ||
            x.query.length > 100 ||
            Object.keys(x).some((k) => k !== "query")
          )
            throw new Error("Expected query up to 100 characters");
          setQuery(x.query);
          setCategory("All");
          await new Promise((resolve) => requestAnimationFrame(resolve));
          return {
            matches: products
              .filter((p) =>
                `${p.name} ${p.description}`
                  .toLowerCase()
                  .includes((x.query as string).toLowerCase()),
              )
              .map(({ name, price, slug }) => ({
                name,
                priceCents: price,
                url: `/demos/form/product/${slug}`,
              })),
          };
        },
      }),
      [],
    ),
  );
  return (
    <section className="shop-catalog wrap" id="catalog">
      <div className="catalog-toolbar">
        <div
          className="category-buttons"
          role="group"
          aria-label="Product categories"
        >
          {["All", "Workspace", "Everyday", "Accessories"].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c === "All" ? "All objects" : c}
            </button>
          ))}
        </div>
        <div className="catalog-tools">
          <label className="search-box">
            <Search size={16} />
            <span className="sr-only">Search products</span>
            <input
              value={query}
              maxLength={100}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find something…"
            />
          </label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger aria-label="Sort products">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="low">Price: low to high</SelectItem>
              <SelectItem value="high">Price: high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="result-count" aria-live="polite">
        {filtered.length} considered{" "}
        {filtered.length === 1 ? "object" : "objects"}
      </p>
      <div className="product-grid">
        {filtered.map((p) => (
          <article key={p.id}>
            <a href={`/demos/form/product/${p.slug}`} className="product-image">
              <img
                src={`/images/${p.image}.webp`}
                alt={p.name + " — illustrative product photograph"}
                width="800"
                height="800"
                loading="lazy"
              />
            </a>
            <div className="product-info">
              <div>
                <h3>
                  <a href={`/demos/form/product/${p.slug}`}>{p.name}</a>
                </h3>
                <p>{p.category}</p>
              </div>
              <strong>{money(p.price)}</strong>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <h2>Nothing here just yet.</h2>
          <p>Try a different search or explore another category.</p>
          <button
            className="text-button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Show all objects
          </button>
        </div>
      )}
    </section>
  );
}
