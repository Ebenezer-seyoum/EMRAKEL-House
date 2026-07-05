import { getPublicContent } from "@/lib/cms";
import { SectionPageShell } from "../section-page-shell";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getPublicContent();
  const { about } = content;

  return (
    <SectionPageShell
      eyebrow={about.eyebrow}
      title={about.headline}
      description={about.description}
      image={about.image}
      backLabel={content.home.backHomeLabel}
    >
      <section className="section aboutStoryGrid">
        <div className="aboutStoryImage">
          <img src={about.image} alt="" />
        </div>
        <div className="aboutStoryText">
          <p className="eyebrow">{about.storyEyebrow}</p>
          <h2>{about.storyHeadline}</h2>
          <p className="contactText">{about.storyDescription}</p>
        </div>
        <div className="aboutStoryImage">
          <img src={about.secondaryImage} alt="" />
        </div>
        <div className="aboutStoryText">
          <p className="eyebrow">{about.secondaryEyebrow}</p>
          <h2>{about.secondaryHeadline}</h2>
          <p className="contactText">{about.secondaryDescription}</p>
        </div>
      </section>
    </SectionPageShell>
  );
}
