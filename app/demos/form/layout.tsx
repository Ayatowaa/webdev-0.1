import type { Metadata } from "next";
import { StoreProvider } from "./store-provider";
import { StoreHeader } from "./store-header";
export const metadata: Metadata = {
  title: "Form Supply — E-commerce Demo",
  description:
    "A fictional essentials store with product discovery, a persistent shopping bag and simulated checkout.",
};
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="form-shop">
      <div className="demo-banner">
        Demo store · No real purchases or payments{" "}
        <a href="/projects/form">About this project</a>
      </div>
      <StoreProvider>
        <StoreHeader />
        {children}
      </StoreProvider>
      <footer className="demo-footer wrap">
        <a className="demo-brand" href="/demos/form">
          form supply
        </a>
        <p>Fictional catalog · Illustrative photography · All prices in USD</p>
        <a href="/">Back to portfolio</a>
      </footer>
    </div>
  );
}
