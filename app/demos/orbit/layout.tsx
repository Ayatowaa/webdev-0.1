import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Orbit Workspace — Full Stack Demo",
  description:
    "A personal demonstration of authenticated project management, REST APIs and persistent data.",
  robots: { index: false, follow: true },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="orbit">
      <div className="demo-banner">
        Personal demo · Fictional projects and budgets{" "}
        <a href="/projects/orbit">About this project</a>
      </div>
      {children}
    </div>
  );
}
