export type PortfolioProject = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  route: string;
  accent: string;
  stack: string[];
  features: string[];
  decisions: string[];
  limitations: string;
};
export const projects: PortfolioProject[] = [
  {
    slug: "auren",
    name: "Auren Studio",
    category: "Business website",
    summary: "An editorial website for a fictional architecture studio.",
    description:
      "A premium business website concept that gives a small studio a clear digital presence. Large imagery, concise service descriptions and a guided enquiry flow keep the visitor focused on the next step.",
    route: "/demos/auren",
    accent: "#b8beaa",
    stack: ["React", "TypeScript", "Responsive CSS", "Form validation"],
    features: [
      "Responsive editorial landing page",
      "Services and approach sections",
      "Accessible navigation and enquiry form",
      "Validated demo enquiry with clear feedback",
    ],
    decisions: [
      "Server-rendered content keeps the initial experience lightweight.",
      "An intentionally small visual system keeps the design coherent across screens.",
      "The enquiry form clearly identifies its simulated behavior; it never pretends to send an email.",
    ],
    limitations:
      "Fictional studio. Enquiries are demonstrated in the browser and are not sent. Images illustrate the concept and are not completed client work.",
  },
  {
    slug: "orbit",
    name: "Orbit Workspace",
    category: "Full stack application",
    summary:
      "A focused project workspace with authentication and persistent CRUD.",
    description:
      "An administrative workspace for organizing projects, tracking budgets and seeing work at a glance. Sign-in protects a personal workspace, while the public preview makes the interface easy to explore.",
    route: "/demos/orbit",
    accent: "#a7c7ff",
    stack: [
      "React",
      "TypeScript",
      "REST API",
      "Cloudflare D1",
      "Drizzle",
      "ChatGPT sign-in",
    ],
    features: [
      "Authenticated, isolated workspace per visitor",
      "Create, read, edit and delete projects",
      "Server-side validation and prepared SQL queries",
      "Search, status filters and calculated overview metrics",
      "Durable SQLite-compatible database",
    ],
    decisions: [
      "Identity is verified on the server for every private endpoint.",
      "Records are scoped to the authenticated user, including updates and deletes.",
      "Public sample data is separated from private data and labeled as fictional.",
    ],
    limitations:
      "Demonstration for project management, not a production business management service. Authentication on this hosted version uses Sign in with ChatGPT. Sample budgets are fictional.",
  },
  {
    slug: "form",
    name: "Form Supply",
    category: "E-commerce experience",
    summary:
      "A curated storefront with a persistent cart and simulated checkout.",
    description:
      "A fictional design-led essentials shop. Visitors can search a six-product catalog, filter by category, inspect product details and complete a simulated order without supplying payment information.",
    route: "/demos/form",
    accent: "#f4c796",
    stack: [
      "React",
      "TypeScript",
      "REST API",
      "Cloudflare D1",
      "Accessible UI",
    ],
    features: [
      "Search, category filters and price sorting",
      "Individual product pages",
      "Server-persisted anonymous cart",
      "Quantity controls and stock limits",
      "Server-calculated totals and idempotent simulated checkout",
    ],
    decisions: [
      "Product prices are authoritative on the server, never trusted from the client.",
      "A random, HttpOnly session cookie associates the cart with its browser.",
      "Checkout collects no payment details and clearly states that no purchase is made.",
    ],
    limitations:
      "Fictional products and prices. No payments, shipping, tax calculation or fulfillment. Product photography is illustrative. Cart is tied to this browser for 30 days.",
  },
];
export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
