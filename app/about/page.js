import { getPublicContent } from "@/lib/cms";
import { SectionPageShell } from "../section-page-shell";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getPublicContent();
  const { about } = content;

  return (
    <SectionPageShell eyebrow={about.eyebrow} title={about.headline} description={about.description} image={about.image}>
      <section className="section aboutStoryGrid">
        <div className="aboutStoryImage">
          <img src={about.image} alt="" />
        </div>
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
        <div className="aboutStoryText">
          <p className="eyebrow">Food focus</p>
          <h2>A simple house menu with room to grow.</h2>
          <p className="contactText">
            Burgers, pizza, sandwiches, shawarma, shakes, mojito, and cocktails are arranged clearly for guests while
            the admin dashboard keeps future edits practical.
          </p>
        </div>
      </section>
    </SectionPageShell>
  );
}
