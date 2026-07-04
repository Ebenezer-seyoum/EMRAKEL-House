"use client";

import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";

export default function MenuOrderClient({ categories, items }) {
  const [quantities, setQuantities] = useState({});
  const [menuUrl, setMenuUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [status, setStatus] = useState("");
  const [customer, setCustomer] = useState({ customer_name: "", phone: "", email: "" });

  const selectedItems = useMemo(
    () =>
      items
        .map((item) => ({
          ...item,
          quantity: Number(quantities[item.id] || 0)
        }))
        .filter((item) => item.quantity > 0),
    [items, quantities]
  );

  const total = selectedItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const topCategories = categories.filter((category) => !category.parentId);
  const childCategories = (parentId) => categories.filter((category) => category.parentId === parentId);
  const categoryItems = (categoryId) => items.filter((item) => item.category === categoryId);
  const boardSections = topCategories.map((category) => {
    const children = childCategories(category.id);
    const sections = children.length ? [category, ...children] : [category];
    const boardItems = sections.flatMap((section) => categoryItems(section.id));

    return {
      ...category,
      children,
      items: boardItems
    };
  }).filter((section) => section.items.length);
  const isDrinkSection = (section) =>
    [section.id, section.name, section.description]
      .join(" ")
      .toLowerCase()
      .match(/drink|shake|mojito|cocktail|juice|coffee|tea/);
  const boardColumns = {
    food: boardSections.filter((section) => !isDrinkSection(section)),
    drinks: boardSections.filter((section) => isDrinkSection(section))
  };

  useEffect(() => {
    const currentMenuUrl = `${window.location.origin}/menu`;
    setMenuUrl(currentMenuUrl);

    const session = JSON.parse(localStorage.getItem("emrakelSession") || "null");
    if (session?.role === "customer") {
      setCustomer({
        customer_name: session.name || "",
        phone: session.phone || "",
        email: session.email || ""
      });
    }

    QRCode.toDataURL(currentMenuUrl, {
      color: {
        dark: "#090a0c",
        light: "#ffffff"
      },
      errorCorrectionLevel: "H",
      margin: 1,
      scale: 8
    }).then(setQrDataUrl);
  }, []);

  function updateQuantity(itemId, value) {
    const quantity = Math.max(0, Number(value || 0));
    setQuantities((current) => ({ ...current, [itemId]: quantity }));
  }

  function updateCustomer(field, value) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  async function submitOrder(event) {
    event.preventDefault();

    if (selectedItems.length === 0) {
      setStatus("Choose at least one item before sending your order.");
      return;
    }

    setStatus("Sending order...");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        total_amount: total,
        items: selectedItems.map((item) => ({
          menu_item_id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit_price: item.price
        }))
      })
    });

    const data = await response.json();
    setStatus(response.ok ? data.message : data.error);

    if (response.ok) {
      event.currentTarget.reset();
      setQuantities({});
    }
  }

  return (
    <>
      <section className="section menuBoardShowcase">
        <div className="menuBoardDynamic">
          <div className="menuBoardTitle">
            <img src="/logo.png" alt="" />
            <p>EMRAKEL</p>
            <span>Burger, Pizza & Cocktail House</span>
            <h2>Menu</h2>
          </div>
          <div className="menuBoardColumns">
            <div className="menuBoardColumn foodColumn">
              {boardColumns.food.map((section) => (
                <article className="menuBoardSection" key={section.id}>
                  {section.items[0]?.image ? <img src={section.items[0].image} alt="" /> : null}
                  <div>
                    <h3>{section.name}</h3>
                    {section.items.slice(0, 8).map((item) => (
                      <p key={item.id}>
                        <span>{item.name}</span>
                        <i />
                        <strong>{item.price} birr</strong>
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="menuBoardColumn drinkColumn">
              <p className="drinkTagline">Refresh. Relax. Enjoy.</p>
              {boardColumns.drinks.map((section) => (
                <article className="menuBoardSection" key={section.id}>
                  {section.items[0]?.image ? <img src={section.items[0].image} alt="" /> : null}
                  <div>
                    <h3>{section.name}</h3>
                    {section.items.slice(0, 8).map((item) => (
                      <p key={item.id}>
                        <span>{item.name}</span>
                        <i />
                        <strong>{item.price} birr</strong>
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        {topCategories.map((category) => {
          const children = childCategories(category.id);
          const sections = children.length ? [category, ...children] : [category];
          const hasItems = sections.some((section) => categoryItems(section.id).length);
          if (!hasItems) {
            return null;
          }

          return (
          <div className="menuPosterSection" key={category.id}>
            <div className="sectionHead">
              <div>
                <p className="eyebrow">{category.description || "Menu section"}</p>
                <h2>{category.name}</h2>
              </div>
            </div>
            {sections.map((section) => {
              const sectionItems = categoryItems(section.id);
              if (!sectionItems.length) {
                return null;
              }

              return (
              <div className="menuSubsection" key={section.id}>
                {children.length ? <h3>{section.id === category.id ? "Featured" : section.name}</h3> : null}
                <div className="menuListGrid">
                  {sectionItems.map((item) => (
                    <article className="menuListItem revealCard" key={item.id}>
                      <img src={item.image || "/uploads/house/menu-board-reference.jpg"} alt="" />
                      <div>
                        <span>{section.name}</span>
                        <h4>{item.name}</h4>
                        <p>{item.description}</p>
                      </div>
                      <strong>{item.price} ETB</strong>
                      <label className="quantityControl">
                        Qty
                        <input
                          aria-label={`${item.name} quantity`}
                          min="0"
                          name={`quantity-${item.id}`}
                          onChange={(event) => updateQuantity(item.id, event.target.value)}
                          type="number"
                          value={quantities[item.id] || ""}
                        />
                      </label>
                    </article>
                  ))}
                </div>
              </div>
            )})}
          </div>
        )})}
      </section>

      <section className="section orderSection">
        <div className="orderAside">
          <div className="panel qrPanel">
            <p className="eyebrow">Menu QR</p>
            <h2>Scan to open the live menu.</h2>
            {qrDataUrl ? <img src={qrDataUrl} alt="QR code for the EMRAKEL menu page" /> : null}
            <p className="contactText">{menuUrl || "Generating menu link..."}</p>
          </div>

          <div className="panel orderSummary">
            <p className="eyebrow">Order summary</p>
            <h2>Send your order</h2>
            {selectedItems.length ? (
              <div className="orderLines">
                {selectedItems.map((item) => (
                  <p key={item.id}>
                    <span>
                      {item.quantity} x {item.name}
                    </span>
                    <strong>{Number(item.price) * item.quantity} ETB</strong>
                  </p>
                ))}
              </div>
            ) : (
              <p className="contactText">Choose quantities from the menu cards. Your total will appear here.</p>
            )}
            <div className="orderTotal">
              <span>Total</span>
              <strong>{total} ETB</strong>
            </div>
          </div>
        </div>

        <div className="formPanel">
          <form onSubmit={submitOrder}>
            <label>
              Full name
              <input
                name="customer_name"
                onChange={(event) => updateCustomer("customer_name", event.target.value)}
                required
                placeholder="Customer name"
                value={customer.customer_name}
              />
            </label>
            <label>
              Phone
              <input
                name="phone"
                onChange={(event) => updateCustomer("phone", event.target.value)}
                required
                placeholder="Phone number"
                value={customer.phone}
              />
            </label>
            <label>
              Email
              <input
                name="email"
                onChange={(event) => updateCustomer("email", event.target.value)}
                placeholder="Email address"
                type="email"
                value={customer.email}
              />
            </label>
            <label>
              Order type
              <select name="order_type" defaultValue="pickup">
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
                <option value="dine_in">Dine in</option>
              </select>
            </label>
            <label>
              Delivery address
              <textarea name="address" placeholder="Required for delivery" />
            </label>
            <label>
              Notes
              <textarea name="notes" placeholder="Special request" />
            </label>
            <button className="button buttonGold" type="submit">
              Send Order
            </button>
            {status ? <p className="contactText">{status}</p> : null}
          </form>
        </div>
      </section>
    </>
  );
}
