import type { Metadata } from "next";
import { EnquiryForm } from "./enquiry";
export const metadata: Metadata = {
  title: "Auren Studio — Business Website Demo",
  description:
    "A fictional architecture studio website. Personal demonstration by Allefy Resende.",
};
export default function Auren() {
  return (
    <div className="auren">
      <div className="demo-banner">
        Personal demo · Fictional architecture studio{" "}
        <a href="/projects/auren">About this project</a>
      </div>
      <header className="demo-nav wrap">
        <a href="/demos/auren" className="demo-brand">
          auren<small>STUDIO</small>
        </a>
        <nav aria-label="Studio navigation">
          <a href="#services">Services</a>
          <a href="#approach">Our approach</a>
          <a className="button dark-button" href="#enquire">
            Discuss your space
          </a>
        </nav>
      </header>
      <main id="main">
        <section className="auren-hero wrap">
          <img
            src="/images/architecture.webp"
            alt="Contemporary interior with natural light, a glass staircase and neutral furniture"
            width="1500"
            height="1000"
            fetchPriority="high"
          />
          <div className="auren-hero-copy">
            <p className="eyebrow">ARCHITECTURE & INTERIORS</p>
            <h1>
              Spaces that
              <br />
              feel like you.
            </h1>
            <p>
              Considered design for the way you live. A quieter balance of form,
              material and everyday life.
            </p>
            <a className="button light-button" href="#services">
              Explore our services
            </a>
          </div>
        </section>
        <section className="auren-intro wrap" id="approach">
          <div>
            <p className="eyebrow">THE AUREN PERSPECTIVE</p>
            <h2 style={{ marginTop: 22 }}>
              Good design
              <br />
              starts with listening.
            </h2>
          </div>
          <p>
            Auren is a fictional design studio exploring thoughtful spaces. This
            concept brings architecture and interiors together around one idea:
            a space should feel beautiful, useful and deeply personal.
          </p>
        </section>
        <section className="auren-services wrap" id="services">
          <p className="eyebrow">WHAT WE ENVISION</p>
          <h2>
            From a first idea
            <br />
            to a sense of place.
          </h2>
          <div className="auren-service-grid">
            {[
              [
                "01",
                "Residential architecture",
                "Spaces shaped around daily rituals, natural light and a meaningful connection to the outdoors.",
              ],
              [
                "02",
                "Interior design",
                "A cohesive language of materials, color and furnishings that makes a space feel complete.",
              ],
              [
                "03",
                "Spatial consultation",
                "A focused starting point to explore layout, opportunities and the direction of a future project.",
              ],
            ].map(([n, t, d]) => (
              <article key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="auren-process">
          <div className="wrap">
            <p className="eyebrow">A CLEARER PROCESS</p>
            <h2 style={{ marginTop: 18 }}>Thoughtful at every step.</h2>
            <div className="auren-process-grid">
              {[
                [
                  "Discover",
                  "Listen first. Understand the space, its constraints and the life it needs to support.",
                ],
                [
                  "Develop",
                  "Explore layout, materials and atmosphere through a coherent design direction.",
                ],
                [
                  "Refine",
                  "Bring the details together and communicate the next steps clearly.",
                ],
              ].map(([t, d], i) => (
                <div key={t}>
                  <h3>
                    0{i + 1} / {t}
                  </h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="auren-contact wrap" id="enquire">
          <div>
            <p className="eyebrow">BEGIN WITH A CONVERSATION</p>
            <h2>
              Tell us about
              <br />
              your space.
            </h2>
            <p>
              Explore the enquiry experience. This is a demonstration: your
              message is not sent or stored.
            </p>
          </div>
          <EnquiryForm />
        </section>
      </main>
      <footer className="demo-footer wrap">
        <a className="demo-brand" href="/demos/auren">
          auren studio
        </a>
        <p>Fictional brand · Concept by Allefy Resende</p>
        <a href="/">Back to portfolio</a>
      </footer>
    </div>
  );
}
