"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="wrap" style={{ paddingBlock: 100 }}>
      <h1 style={{ fontSize: 40, marginBottom: 25 }}>
        Something interrupted this page.
      </h1>
      <p>Please try again. Your saved records are not removed by this error.</p>
      <button className="button blue" onClick={reset} style={{ marginTop: 25 }}>
        Try again
      </button>
      <a className="text-button" href="/">
        Back to portfolio
      </a>
    </main>
  );
}
