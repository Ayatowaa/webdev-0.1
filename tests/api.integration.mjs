import assert from "node:assert/strict";
const origin = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost", "127.0.0.1"].includes(new URL(origin).hostname))
  throw new Error(
    "Integration tests are local only. Never forge identity headers against a hosted service.",
  );
const suffix = crypto.randomUUID();
const ownerA = {
  "oai-authenticated-user-id": "test-a-" + suffix,
  "oai-authenticated-user-email": "a@example.test",
};
const ownerB = {
  "oai-authenticated-user-id": "test-b-" + suffix,
  "oai-authenticated-user-email": "b@example.test",
};
let count = 0;
async function request(path, method = "GET", data, headers = {}) {
  const r = await fetch(origin + path, {
    method,
    headers: {
      ...(method === "GET"
        ? {}
        : { "Content-Type": "application/json", Origin: origin }),
      ...headers,
    },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  });
  const raw = await r.text();
  let d;
  try {
    d = JSON.parse(raw);
  } catch {
    d = { error: raw };
  }
  return { r, d };
}
function check(value, message) {
  assert.ok(value, message);
  console.log("PASS", message);
  count++;
}
let result = await request("/api/orbit/projects");
check(result.r.status === 401, "Anonymous workspace read rejected");
result = await request("/api/orbit/projects", "POST", {}, ownerA);
check(result.r.status === 400, "Invalid project rejected");
const project = {
  name: "Integration test",
  client: "Fictional test only",
  status: "Planning",
  budget: 12345,
  dueDate: "2026-12-01",
  notes: "Disposable local test record",
};
result = await request("/api/orbit/projects", "POST", project, ownerA);
check(result.r.status === 201, "Authenticated project created");
const id = result.d.project.id;
result = await request("/api/orbit/projects", "GET", undefined, ownerA);
check(
  result.d.projects.some((p) => p.id === id),
  "Created project persisted",
);
result = await request("/api/orbit/projects", "GET", undefined, ownerB);
check(
  !result.d.projects.some((p) => p.id === id),
  "Workspace ownership isolation",
);
result = await request(
  "/api/orbit/projects/" + id,
  "PATCH",
  { ...project, status: "Active" },
  ownerB,
);
check(result.r.status === 404, "Cross-user update rejected");
result = await request("/api/orbit/projects/" + id, "DELETE", {}, ownerB);
check(result.r.status === 404, "Cross-user delete rejected");
result = await request(
  "/api/orbit/projects/" + id,
  "PATCH",
  { ...project, status: "Active", budget: 25000 },
  ownerA,
);
check(result.r.status === 200, "Owner update accepted");
result = await request("/api/orbit/projects", "GET", undefined, ownerA);
check(
  result.d.projects.find((p) => p.id === id)?.budget === 25000,
  "Updated values persisted",
);
result = await request("/api/orbit/projects", "POST", project, {
  ...ownerA,
  Origin: "https://other.example",
});
check(result.r.status === 403, "Cross-origin mutation rejected");
result = await request(
  "/api/orbit/projects",
  "POST",
  { ...project, dueDate: "2026-02-31" },
  ownerA,
);
check(result.r.status === 400, "Impossible date rejected");
result = await request("/api/orbit/projects/" + id, "DELETE", {}, ownerA);
check(result.r.status === 200, "Owner deletion accepted");
result = await request("/api/orbit/projects", "GET", undefined, ownerA);
check(!result.d.projects.some((p) => p.id === id), "Deleted record absent");
result = await request("/api/store/cart", "POST", {
  productId: "lamp",
  quantity: 2,
  mode: "add",
  price: 1,
});
check(
  result.r.status === 200 && result.d.total === 17800,
  "Cart calculates authoritative catalog price",
);
const cookie = result.r.headers.get("set-cookie").split(";")[0];
const cartHeaders = { Cookie: cookie };
result = await request("/api/store/cart", "GET", undefined, cartHeaders);
check(result.d.items[0].quantity === 2, "Cart persists across requests");
result = await request("/api/store/cart");
check(result.d.items.length === 0, "Cart isolated from other sessions");
result = await request(
  "/api/store/cart",
  "POST",
  { productId: "lamp", quantity: 99, mode: "set" },
  cartHeaders,
);
check(result.r.status === 400, "Stock overflow rejected");
result = await request(
  "/api/store/cart",
  "POST",
  { productId: "lamp", quantity: 1.5, mode: "set" },
  cartHeaders,
);
check(result.r.status === 400, "Fractional quantity rejected");
result = await request(
  "/api/store/cart",
  "POST",
  { productId: "unknown", quantity: 1, mode: "add" },
  cartHeaders,
);
check(result.r.status === 400, "Unknown product rejected");
result = await request("/api/store/cart", "POST", null, cartHeaders);
check(result.r.status === 400, "Non-object JSON rejected");
result = await request(
  "/api/store/cart",
  "POST",
  { productId: "lamp", quantity: 3, mode: "set" },
  cartHeaders,
);
check(result.d.total === 26700, "Cart quantity update recalculates total");
const key = crypto.randomUUID();
result = await request(
  "/api/store/checkout",
  "POST",
  { simulationAccepted: false, idempotencyKey: key },
  cartHeaders,
);
check(result.r.status === 400, "Checkout requires simulation acknowledgement");
result = await request(
  "/api/store/checkout",
  "POST",
  { simulationAccepted: true, idempotencyKey: key, total: 1 },
  cartHeaders,
);
check(
  result.r.status === 201 &&
    result.d.order.total === 26700 &&
    result.d.simulated === true,
  "Simulated checkout records server total",
);
const orderId = result.d.order.id;
result = await request(
  "/api/store/checkout",
  "POST",
  { simulationAccepted: true, idempotencyKey: key },
  cartHeaders,
);
check(result.d.order.id === orderId, "Idempotent retry returns same order");
result = await request("/api/store/cart", "GET", undefined, cartHeaders);
check(result.d.items.length === 0, "Purchased demo cart cleared");
result = await request(
  "/api/store/checkout",
  "POST",
  { simulationAccepted: true, idempotencyKey: crypto.randomUUID() },
  cartHeaders,
);
check(result.r.status === 400, "Empty cart checkout rejected");
console.log(`${count} integration checks passed.`);
