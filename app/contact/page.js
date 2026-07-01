import { Footer, Header } from "../shared";
import { brand } from "@/lib/data";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pageHero">
          <p className="eyebrow">Contact</p>
          <h1>Visit, call, or send a message.</h1>
        </section>
        <section className="section contactGrid">
          <div className="panel">
            <h2>{brand.name}</h2>
            <p className="contactText">{brand.address}</p>
            <p className="contactText">{brand.hours}</p>
            <p className="contactText">{brand.phone}</p>
            <p className="contactText">{brand.email}</p>
          </div>
          <div className="formPanel">
            <form>
              <label>
                Name
                <input name="name" placeholder="Your name" />
              </label>
              <label>
                Phone
                <input name="phone" placeholder="Phone number" />
              </label>
              <label>
                Message
                <textarea name="message" placeholder="How can we help?" />
              </label>
              <button className="button buttonGold" type="submit">
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
