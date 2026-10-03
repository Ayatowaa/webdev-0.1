import {
  sqliteTable,
  text,
  integer,
  index,
  primaryKey,
} from "drizzle-orm/sqlite-core";
export const workspaces = sqliteTable("workspaces", {
  ownerId: text("owner_id").primaryKey(),
  createdAt: integer("created_at").notNull(),
});
export const workProjects = sqliteTable(
  "work_projects",
  {
    id: text("id").primaryKey(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    client: text("client").notNull(),
    status: text("status").notNull(),
    budget: integer("budget").notNull(),
    dueDate: text("due_date").notNull(),
    notes: text("notes").notNull().default(""),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (t) => [index("idx_projects_owner_created").on(t.ownerId, t.createdAt)],
);
export const cartItems = sqliteTable(
  "cart_items",
  {
    sessionId: text("session_id").notNull(),
    productId: text("product_id").notNull(),
    quantity: integer("quantity").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.sessionId, t.productId] }),
    index("idx_cart_updated").on(t.updatedAt),
  ],
);
export const demoOrders = sqliteTable(
  "demo_orders",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id").notNull(),
    idempotencyKey: text("idempotency_key").notNull().unique(),
    total: integer("total").notNull(),
    itemsJson: text("items_json").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [index("idx_orders_session").on(t.sessionId)],
);
