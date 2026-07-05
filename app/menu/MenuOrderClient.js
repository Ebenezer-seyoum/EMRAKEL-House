"use client";

export default function MenuOrderClient({ categories, items, previewLimitItems = 0 }) {
  const topCategories = categories.filter((category) => !category.parentId);
  const childCategories = (parentId) => categories.filter((category) => category.parentId === parentId);
  const visibleItems = previewLimitItems ? items.slice(-previewLimitItems) : items;
  const categoryItems = (categoryId) => visibleItems.filter((item) => item.category === categoryId);
  const boardSections = topCategories
    .flatMap((category) => {
      const children = childCategories(category.id);
      return children.length ? children : [category];
    })
    .map((section) => ({
      ...section,
      items: categoryItems(section.id)
    }))
    .filter((section) => section.items.length);
  const boardColumns = {
    food: boardSections.filter((section) => section.menuSide !== "drinks"),
    drinks: boardSections.filter((section) => section.menuSide === "drinks")
  };
  const renderSection = (section) => {
    const sectionImage = section.image;

    return (
      <article className="menuBoardSection" key={section.id}>
        {sectionImage ? <img className="menuBoardSectionImage" src={sectionImage} alt="" /> : null}
        <div>
          <h3>{section.name}</h3>
          {section.items.slice(0, previewLimitItems ? 5 : 10).map((item) => (
            <p key={item.id}>
              <span>{item.name}</span>
              <i />
              <strong>{item.price} birr</strong>
            </p>
          ))}
        </div>
      </article>
    );
  };

  return (
      <section className="menuBoardShowcase scanMenuPage">
        <div className="menuBoardDynamic">
          <div className="menuBoardTitle">
            <img src="/logo.png" alt="" />
            <p>EMRAKEL</p>
            <span>Burger, Pizza & Cocktail House</span>
            <h2>Menu</h2>
          </div>
          <div className="menuBoardColumns">
            <div className="menuBoardColumn foodColumn">
              <div className="foodPosterTitle">
                <span>Good Food, Great Moments</span>
                <strong>EMRAKEL</strong>
                <em>MENU</em>
              </div>
              {boardColumns.food.length ? boardColumns.food.map((section) => renderSection(section)) : (
                <p className="menuBoardEmpty">Food menu coming soon.</p>
              )}
            </div>
            <div className="menuBoardColumn drinkColumn">
              <p className="drinkTagline">Refresh. Relax. Enjoy.</p>
              {boardColumns.drinks.length ? boardColumns.drinks.map((section) => renderSection(section)) : (
                <p className="menuBoardEmpty">Drink menu coming soon.</p>
              )}
            </div>
          </div>
        </div>
      </section>
  );
}
