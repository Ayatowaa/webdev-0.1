import { Catalog } from "./catalog";
export default function Store() {
  return (
    <main id="main">
      <section className="store-hero wrap">
        <div>
          <p className="eyebrow">LESS, BUT CONSIDERED.</p>
          <h1>
            Good things.
            <br />
            Everyday rituals.
          </h1>
          <p>
            Objects for your desk, your day and the moments in between. Explore
            a thoughtfully curated concept collection.
          </p>
          <a className="button" href="#catalog">
            Discover the collection
          </a>
        </div>
        <img
          src="/images/lamp.webp"
          alt="Sculptural desk lamp photographed in natural light"
          width="800"
          height="700"
          fetchPriority="high"
        />
      </section>
      <Catalog />
      <section className="shop-values wrap">
        <div>
          <strong>Considered essentials</strong>
          <p>A small collection, selected with intention.</p>
        </div>
        <div>
          <strong>Explore without commitment</strong>
          <p>A simulated store. No payment details required.</p>
        </div>
        <div>
          <strong>A personal design study</strong>
          <p>Created by Allefy Resende for this portfolio.</p>
        </div>
      </section>
    </main>
  );
}
