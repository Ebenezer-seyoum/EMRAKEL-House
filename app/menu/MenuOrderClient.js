"use client";

import { useMemo, useState } from "react";

export default function MenuOrderClient({ categories, items }) {
  const [quantities, setQuantities] = useState({});
  const [status, setStatus] = useState("");

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

  function updateQuantity(itemId, value) {
    const quantity = Math.max(0, Number(value || 0));
    setQuantities((current) => ({ ...current, [itemId]: quantity }));
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
      <section className="section">
        {categories.map((category) => (
          <div className="categoryBlock" key={category.id}>
            <div className="sectionHead">
              <h2>{category.name}</h2>
            </div>
            <div className="cardGrid">
              {items
                .filter((item) => item.category === category.id)
                .map((item) => (
                  <article className="menuCard revealCard" key={item.id}>
                    <img src={item.image} alt="" />
                    <div>
                      <span>{category.name}</span>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <div className="menuCardBottom">
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
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </section>

      <section className="section orderSection">
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

        <div className="formPanel">
          <form onSubmit={submitOrder}>
            <label>
              Full name
              <input name="customer_name" required placeholder="Customer name" />
            </label>
            <label>
              Phone
              <input name="phone" required placeholder="Phone number" />
            </label>
            <label>
              Email
              <input name="email" type="email" placeholder="Email address" />
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
