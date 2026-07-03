import { Footer, Header } from "../shared";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pageHero">
          <p className="eyebrow">About us</p>
          <h1>EMRAKEL is built as a precise black-and-white burger house.</h1>
          <p className="pageLead">
            The brand combines bold comfort food with a refined interior mood: black contrast, white clarity, and clean
            modern spacing that keeps the logo at the center.
          </p>
        </section>
        <section className="section introGrid">
          <div className="panel">
            <h2>House style</h2>
            <p className="contactText">
              The website follows the supplied logo with a restrained monochrome palette, crisp typography, and subtle
              motion instead of decorative color effects.
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
