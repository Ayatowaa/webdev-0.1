import { siteUrl } from "@/lib/site";
export const metadata = { alternates: { canonical: siteUrl } };
import { Header } from "@/components/portfolio/header";
import { Contact } from "@/components/portfolio/contact";
import { projects } from "@/lib/projects";
import { profile } from "@/lib/profile";
import { Code2, Layers3, Database, CodeXml } from "lucide-react";
export default function Home() {
  return (
    <div className="portfolio">
      <Header />
      <main id="main">
        <section className="hero wrap">
          <div className="hero-topline">
            <span className="eyebrow">
              ALLEFY RESENDE / FULL STACK DEVELOPER
            </span>
            <span className="availability">
              <i /> Open to freelance projects
            </span>
          </div>
          <h1>
            Thoughtful interfaces.
            <br />
            <span>Working solutions.</span>
          </h1>
          <div className="hero-bottom">
            <p>
              I build websites and web applications that connect clear design
              with practical functionality.
            </p>
            <div className="hero-actions">
              <a className="button bright" href="#work">
                Explore my work
              </a>
              <a
                className="button ghost"
                href={profile.github}
                target="_blank"
                rel="noreferrer"
              >
                <CodeXml size={18} /> GitHub
              </a>
            </div>
          </div>
          <div className="hero-foot">
            <span>{profile.location}</span>
            <span>DESIGN · DEVELOP · REFINE</span>
          </div>
        </section>
        <section className="work-section wrap" id="work">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / SELECTED WORK</p>
              <h2>Ideas, made tangible.</h2>
            </div>
            <p>
              Three personal projects.
              <br />
              Three different challenges.
            </p>
          </div>
          <div className="project-grid">
            {projects.map((p, i) => (
              <article
                key={p.slug}
                className={`project-card project-${p.slug}`}
              >
                <a
                  href={`/projects/${p.slug}`}
                  className="project-visual"
                  aria-label={`View ${p.name} case study`}
                >
                  <img
                    src={`/screenshots/${p.slug}-desktop.webp`}
                    alt={`${p.name} website interface`}
                    width="1440"
                    height="1000"
                    loading="lazy"
                  />
                  <span className="project-number">0{i + 1}</span>
                </a>
                <div className="project-meta">
                  <p className="eyebrow">
                    {p.category} <span> / PERSONAL DEMO</span>
                  </p>
                  <h3>
                    <a href={`/projects/${p.slug}`}>{p.name}</a>
                  </h3>
                  <p>{p.summary}</p>
                  <div className="project-links">
                    <a href={`/projects/${p.slug}`}>View case study</a>
                    <a href={p.route}>Explore demo</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="about-section wrap" id="about">
          <div>
            <p className="eyebrow">02 / A LITTLE CONTEXT</p>
            <h2>
              Curious by nature.
              <br />
              <span>Practical by design.</span>
            </h2>
          </div>
          <div className="about-copy">
            <p>
              I’m Allefy, an early-career Full Stack Developer based in Brazil.
              I’m building my practice through hands-on projects and looking for
              my first freelance collaborations.
            </p>
            <p>
              I use AI-assisted development alongside documentation, testing and
              iterative review. My focus is straightforward: understand the
              problem, build a usable solution and make the code easier to
              maintain.
            </p>
            <p className="honesty-note">
              Everything featured here is a personal demonstration. No invented
              clients, credentials or commercial results.
            </p>
          </div>
        </section>
        <section className="skills-section wrap" id="skills">
          <div className="section-heading">
            <div>
              <p className="eyebrow">03 / CAPABILITIES</p>
              <h2>
                From the interface
                <br />
                to the data behind it.
              </h2>
            </div>
            <p>
              Technologies used in this portfolio.
              <br />
              Skills I’m continuing to develop.
            </p>
          </div>
          <div className="skill-grid">
            {[
              {
                icon: Code2,
                title: "Interface development",
                text: "Responsive layouts, reusable components and accessible interactions.",
                skills: ["React", "TypeScript", "HTML & CSS"],
              },
              {
                icon: Database,
                title: "Application foundations",
                text: "Validated APIs, relational data and authenticated experiences.",
                skills: ["REST APIs", "SQLite / D1", "Drizzle"],
              },
              {
                icon: Layers3,
                title: "A considered workflow",
                text: "Version control, testing, documentation and iterative refinement.",
                skills: [
                  "Git & GitHub",
                  "AI-assisted development",
                  "Vite / Vinext",
                ],
              },
            ].map((x) => (
              <article key={x.title}>
                <x.icon size={25} />
                <h3>{x.title}</h3>
                <p>{x.text}</p>
                <div className="chips">
                  {x.skills.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
        <Contact />
      </main>
      <footer className="portfolio-footer wrap">
        <a className="wordmark" href="/">
          ar<span>.</span>
        </a>
        <p>© {new Date().getFullYear()} Allefy Resende</p>
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        {profile.linkedin && <a href={profile.linkedin}>LinkedIn</a>}
        <span>Built with care. Always improving.</span>
      </footer>
    </div>
  );
}
