import test from "node:test";
import assert from "node:assert/strict";
import { cartTotal, products } from "../lib/catalog.ts";
import { projectInput } from "../lib/orbit.ts";
import { body, HttpError } from "../lib/http.ts";
import { randomId } from "../lib/client-id.ts";
test("catalog total uses integer cents", () => {
  assert.equal(
    cartTotal([
      { productId: "lamp", quantity: 2 },
      { productId: "notebook", quantity: 3 },
    ]),
    23200,
  );
});
test("catalog identifiers are unique", () => {
  assert.equal(new Set(products.map((p) => p.id)).size, products.length);
  assert.equal(new Set(products.map((p) => p.slug)).size, products.length);
});
test("cart rejects unknown, fractional and out-of-stock quantities", () => {
  for (const item of [
    { productId: "invalid", quantity: 1 },
    { productId: "lamp", quantity: 1.5 },
    { productId: "lamp", quantity: 99 },
    { productId: "lamp", quantity: 0 },
  ])
    assert.throws(() => cartTotal([item]));
});
const project = {
  name: "Demo",
  client: "Personal",
  status: "Planning",
  budget: 1000,
  dueDate: "2026-12-01",
  notes: "",
};
test("project validation accepts valid data", () =>
  assert.equal(projectInput.safeParse(project).success, true));
test("project validation rejects impossible date, negative budget and unknown status", () => {
  for (const delta of [
    { dueDate: "2026-02-31" },
    { budget: -1 },
    { status: "Admin" },
    { name: " " },
    { budget: 1.1 },
  ])
    assert.equal(
      projectInput.safeParse({ ...project, ...delta }).success,
      false,
    );
});
test("project validation rejects unknown fields", () =>
  assert.equal(
    projectInput.safeParse({ ...project, ownerId: "other" }).success,
    false,
  ));
test("request guard rejects wrong origin", async () => {
  const r = new Request("https://example.test/api", {
    method: "POST",
    headers: {
      Origin: "https://evil.test",
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  await assert.rejects(
    body(r),
    (e) => e instanceof HttpError && e.status === 403,
  );
});
test("request guard rejects non-object JSON", async () => {
  const r = new Request("https://example.test/api", {
    method: "POST",
    headers: {
      Origin: "https://example.test",
      "Content-Type": "application/json",
    },
    body: "null",
  });
  await assert.rejects(
    body(r),
    (e) => e instanceof HttpError && e.status === 400,
  );
});
test("request guard rejects large body", async () => {
  const r = new Request("https://example.test/api", {
    method: "POST",
    headers: {
      Origin: "https://example.test",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: "x".repeat(10001) }),
  });
  await assert.rejects(
    body(r),
    (e) => e instanceof HttpError && e.status === 413,
  );
});
test("client id is a valid random UUID", () => {
  const id = randomId();
  assert.match(
    id,
    /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/,
  );
  assert.notEqual(id, randomId());
});
