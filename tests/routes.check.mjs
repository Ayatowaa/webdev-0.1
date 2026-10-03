import assert from "node:assert/strict";
const origin = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
const routes = [
  "/",
  "/projects/auren",
  "/projects/orbit",
  "/projects/form",
  "/demos/auren",
  "/demos/orbit",
  "/demos/orbit/workspace",
  "/demos/form",
  "/demos/form/cart",
  "/demos/form/checkout",
  "/demos/form/product/arc-desk-lamp",
  "/demos/form/product/quiet-headphones",
  "/demos/form/product/daily-ceramic-mug",
  "/demos/form/product/field-notebook",
  "/demos/form/product/daypack",
  "/demos/form/product/essential-watch",
  "/robots.txt",
  "/sitemap.xml",
];
const assets = new Set(["/favicon.svg"]);
for (const route of routes) {
  const response = await fetch(origin + route);
  assert.equal(response.status, 200, route);
  const html = await response.text();
  if (!route.endsWith(".txt") && !route.endsWith(".xml")) {
    assert.match(html, /<title>/, route + " title");
    assert.match(html, /<main/, route + " main");
    for (const m of html.matchAll(
      /(?:src|href)="(\/[^"?#]+)(?:[?#][^"]*)?"/g,
    )) {
      if (m[1].startsWith("/images/") || m[1].startsWith("/screenshots/"))
        assets.add(m[1]);
    }
  }
  console.log("PASS route", route);
}
for (const asset of assets) {
  const r = await fetch(origin + asset);
  assert.equal(r.status, 200, asset);
  assert.ok(
    Number(r.headers.get("content-length")) > 0 ||
      (await r.arrayBuffer()).byteLength > 0,
    asset,
  );
}
for (const route of [
  "/does-not-exist",
  "/projects/unknown",
  "/demos/form/product/unknown",
]) {
  assert.equal((await fetch(origin + route)).status, 404, route);
}
console.log(
  `${routes.length} routes, ${assets.size} assets and 3 not-found paths passed.`,
);
