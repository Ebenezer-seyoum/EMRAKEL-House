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
        <section className="section aboutStoryGrid">
          <div className="aboutStoryText">
            <p className="eyebrow">House style</p>
            <h2>Designed for comfort, conversation, and evening energy.</h2>
            <p className="contactText">
              EMRAKEL brings together warm lighting, painted walls, greenery, lounge seating, and a food-first menu so
              guests can relax from the first scan of the menu to the last drink.
            </p>
          </div>
          <div className="aboutStoryImage">
            <img src={about.secondaryImage} alt="" />
          </div>
          <div className="aboutStoryImage">
            <img src="/uploads/house/interior-08.jpg" alt="" />
          </div>
          <div className="aboutStoryText">
            <p className="eyebrow">Food focus</p>
            <h2>A simple house menu with room to grow.</h2>
            <p className="contactText">
              Burgers, pizza, sandwiches, shawarma, shakes, mojito, and cocktails are arranged clearly for guests while
              the admin dashboard keeps future edits practical.
            </p>
          </div>
        </section>
      </main>
      <Footer brandData={content.brand} footerData={content.footer} />
    </>
  );
}
