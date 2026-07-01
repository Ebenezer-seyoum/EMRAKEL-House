import { Footer, Header } from "../shared";
import { menuCategories, menuItems } from "@/lib/data";

export default function MenuPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pageHero">
          <p className="eyebrow">Order online</p>
          <h1>Classic burgers, golden pizza, and polished cocktails.</h1>
          <p className="pageLead">
            Menu content is structured for the admin dashboard and database, so prices, images, categories, and item
            descriptions can be changed later from simple inputs.
          </p>
        </section>
        <section className="section">
          {menuCategories.map((category) => (
            <div className="categoryBlock" key={category.id}>
              <div className="sectionHead">
                <h2>{category.name}</h2>
              </div>
              <div className="cardGrid">
                {menuItems
                  .filter((item) => item.category === category.id)
                  .map((item) => (
                    <article className="menuCard" key={item.id}>
                      <img src={item.image} alt="" />
                      <div>
                        <span>{category.name}</span>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <strong>{item.price} ETB</strong>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
