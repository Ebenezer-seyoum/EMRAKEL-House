import { Footer, Header } from "../shared";
import { getPublicContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getPublicContent();
  const { about } = content;

  return (
    <>
      <Header brandData={content.brand} />
      <main>
        <section className="pageHero mediaPageHero">
          <div>
            <p className="eyebrow">{about.eyebrow}</p>
            <h1>{about.headline}</h1>
            <p className="pageLead">{about.description}</p>
          </div>
          <img src={about.image} alt="" />
        </section>
        <section className="section introGrid">
          <div className="panel">
            <h2>House style</h2>
            <p className="contactText">
              A dark blue, charcoal, ivory, and brass palette follows the real interior mood: warm lights, leafy ceiling
              details, black marble, and hand-painted walls.
            </p>
          </div>
          <div className="panel imagePanel">
            <img src={about.secondaryImage} alt="" />
          </div>
          <div className="panel">
            <h2>Food focus</h2>
            <p className="contactText">
              Burgers, pizza, and cocktails each get clear menu categories, making the public site simple while keeping
              the admin side flexible for daily updates.
            </p>
          </div>
        </section>
      </main>
      <Footer brandData={content.brand} footerData={content.footer} />
    </>
  );
}
