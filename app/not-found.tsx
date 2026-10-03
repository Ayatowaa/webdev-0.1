export default function NotFound() {
  return (
    <main id="main" className="wrap" style={{ paddingBlock: 100 }}>
      <p className="eyebrow">404 / PAGE NOT FOUND</p>
      <h1 style={{ fontSize: 48, margin: "25px 0" }}>
        A page still to be built.
      </h1>
      <p>This address does not match a project or product.</p>
      <a href="/" className="button blue" style={{ marginTop: 30 }}>
        Back to the portfolio
      </a>
    </main>
  );
}
