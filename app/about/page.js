import { Footer, Header } from "../shared";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pageHero">
          <p className="eyebrow">About us</p>
          <h1>EMRAKEL is built as a classic food and cocktail house.</h1>
          <p className="pageLead">
            The brand combines bold comfort food with a refined interior mood: warm ivory surfaces, charcoal contrast,
            antique gold trim, and ember-orange accents from the food and cocktail identity.
          </p>
        </section>
        <section className="section introGrid">
          <div className="panel">
            <h2>House style</h2>
            <p className="contactText">
              The interior video direction suggests a warm, polished room. The website follows that feeling with classic
              typography, restrained color, and large real media instead of decorative gradients.
            </p>
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
      <Footer />
    </>
  );
}
