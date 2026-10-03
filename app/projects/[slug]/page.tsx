import { siteUrl } from "@/lib/site";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";
import { Header } from "@/components/portfolio/header";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = getProject((await params).slug);
  return {
    title: p?.name ?? "Project not found",
    description: p?.summary,
    alternates: { canonical: p ? siteUrl + "/projects/" + p.slug : undefined },
  };
}
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  return (
    <div className="portfolio">
      <Header />
      <main id="main" className="wrap case-study">
        <a className="back-link" href="/#work">
          All projects
        </a>
        <p className="eyebrow">PERSONAL DEMONSTRATION / {p.category}</p>
        <h1>{p.name}</h1>
        <p className="case-intro">{p.description}</p>
        <div className="case-actions">
          <a className="button bright" href={p.route}>
            Explore live demo
          </a>
          <a className="button ghost" href="/source-code.zip" download>
            Download source code
          </a>
        </div>
        <img
          className="case-screenshot"
          src={`/screenshots/${p.slug}-desktop.webp`}
          alt={`${p.name} desktop screenshot`}
          width="1440"
          height="1000"
        />
        <div className="case-columns">
          <section>
            <h2>What it does</h2>
            <ul>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <h2>Built with</h2>
            <div className="chips">
              {p.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </section>
          <section>
            <h2>Implementation choices</h2>
            {p.decisions.map((d) => (
              <p key={d}>{d}</p>
            ))}
            <aside className="case-note">
              <strong>Scope & honesty</strong>
              <p>{p.limitations}</p>
            </aside>
          </section>
        </div>
        <section className="mobile-case">
          <div>
            <p className="eyebrow">SMALL SCREENS, SAME INTENT</p>
            <h2>
              Designed for the
              <br />
              way people browse.
            </h2>
            <p>
              Responsive layouts, readable text and touch-friendly controls are
              part of the project from the start.
            </p>
          </div>
          <img
            src={`/screenshots/${p.slug}-mobile.webp`}
            alt={`${p.name} mobile screenshot`}
            width="390"
            height="844"
            loading="lazy"
          />
        </section>
        <a className="button bright" href="/#contact">
          Discuss a similar project
        </a>
      </main>
      <footer className="wrap simple-footer">
        Personal project by Allefy Resende. Not a real client engagement.
      </footer>
    </div>
  );
}
