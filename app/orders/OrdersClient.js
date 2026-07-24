"use client";

import { useEffect, useMemo, useState } from "react";
import { menuCategories, menuItems } from "@/lib/data";

const money = (value) => Number(value || 0).toLocaleString() + " ETB";
const statuses = ["pending", "preparing", "ready", "finished"];

export default function OrdersClient() {
  const [table, setTable] = useState("1");
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [liveCategories, setLiveCategories] = useState(menuCategories);
  const [liveItems, setLiveItems] = useState(menuItems);
  const [message, setMessage] = useState("");

  const loadMenu = async () => {
    const response = await fetch("/api/menu", { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.categories) && Array.isArray(data.items)) {
        setLiveCategories(data.categories);
        setLiveItems(data.items);
      }
    }
  };

  const loadOrders = async () => {
    const response = await fetch("/api/orders", { headers: { "x-emrakel-role": "admin" } });
    if (response.ok) setOrders((await response.json()).orders || []);
  };

  useEffect(() => {
    loadMenu();
    loadOrders();
    const timer = window.setInterval(() => { loadMenu(); loadOrders(); }, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const rootCategories = useMemo(() => liveCategories.filter((item) => !item.parentId && item.isActive !== false), [liveCategories]);
  const menuSections = useMemo(() => rootCategories.flatMap((root) => {
    const children = liveCategories.filter((item) => item.parentId === root.id && item.isActive !== false);
    return children.length ? children : [root];
  }), [liveCategories, rootCategories]);
  const visibleSections = useMemo(() => menuSections.filter((section) => category === "all" || section.id === category || section.parentId === category), [category, menuSections]);
  const total = cart.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0);
  const visibleOrders = orders.filter((order) => String(order.status || "pending") === statusFilter);

  const add = (item) => setCart((current) => current.some((line) => line.id === item.id)
    ? current.map((line) => line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line)
    : [...current, { ...item, quantity: 1 }]);
  const change = (id, delta) => setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));

  const submit = async () => {
    if (!cart.length) return;
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-emrakel-role": "admin" },
      body: JSON.stringify({
        customer_name: "Table " + table,
        phone: "in-person",
        order_type: "dine-in",
        table_number: table,
        items: cart.map((item) => ({ menu_item_id: item.id, name: item.name, quantity: item.quantity, unit_price: item.price })),
        total_amount: total
      })
    });
    if (response.ok) {
      setMessage("Order submitted for Table " + table);
      setCart([]);
      loadOrders();
    }
  };

  const updateStatus = async (order, nextStatus) => {
    const response = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-emrakel-role": "admin" },
      body: JSON.stringify({ id: order.id, status: nextStatus, payment_method: "cash" })
    });
    if (response.ok) {
      setMessage(nextStatus === "finished" ? "Order finished and added to income." : "Order status updated.");
      loadOrders();
    }
  };

  return (
    <section className="waiterWorkspace">
      <header className="waiterTopbar">
        <div className="waiterBrand"><span className="waiterBrandMark">E</span><div><strong>EMRAKEL</strong><small>Burger, Pizza & Cocktail House</small></div></div>
        <h1>Waiter Orders</h1>
        <label className="tablePicker">Table<select value={table} onChange={(event) => setTable(event.target.value)}>{Array.from({ length: 10 }, (_, index) => <option key={index + 1}>{index + 1}</option>)}</select></label>
        <span className="liveIndicator">● Live</span>
      </header>

      <div className="waiterLayout">
        <main className="waiterMenuArea">
          <div className="waiterCategoryTabs">
            <button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>▦ All</button>
            {rootCategories.map((item) => <button className={category === item.id ? "active" : ""} key={item.id} onClick={() => setCategory(item.id)}>{item.name}</button>)}
          </div>
          {visibleSections.map((section) => {
            const sectionItems = liveItems.filter((item) => item.category === section.id && item.isActive !== false);
            return <section className="waiterMenuSection" key={section.id}><div className="waiterSectionHeading"><h2>{section.name}</h2><span>{section.description}</span></div><div className="waiterItemGrid">{sectionItems.map((item) => <article className="waiterItemCard" key={item.id}><img src={item.image || "/logo.png"} alt="" /><div className="waiterItemInfo"><h3>{item.name}</h3><p>{item.description}</p><div><strong>{money(item.price)}</strong><button className="waiterAddButton" onClick={() => add(item)}>Add</button></div></div></article>)}</div></section>;
          })}
        </main>

        <aside className="waiterSidePanel">
          <section className="waiterCurrentOrder">
            <div className="waiterPanelHeading"><h2>Current Order</h2><strong>Table {table}</strong></div>
            {cart.length ? cart.map((item) => <div className="waiterCartLine" key={item.id}><div><strong>{item.name}</strong><span>{money(item.price)} each</span></div><div className="waiterQuantity"><button onClick={() => change(item.id, -1)}>−</button><b>{item.quantity}</b><button onClick={() => change(item.id, 1)}>+</button></div></div>) : <p className="waiterEmpty">Select menu items to begin.</p>}
            <div className="waiterTotal"><span>Total</span><strong>{money(total)}</strong></div>
            <button className="waiterSubmitButton" disabled={!cart.length} onClick={submit}>▣ Submit Order</button>
            {message && <p className="waiterMessage">{message}</p>}
          </section>

          <section className="waiterQueue">
            <div className="waiterStatusTabs">{statuses.map((status) => <button className={statusFilter === status ? "active" : ""} key={status} onClick={() => setStatusFilter(status)}>{status}</button>)}</div>
            {visibleOrders.length ? visibleOrders.map((order) => <article className="waiterQueueCard" key={order.id}><div><b>#{String(order.id).slice(-4)}</b><span>{order.customer_name}</span></div><div><strong>{money(order.total_amount)}</strong><small>{(order.items || order.order_items || []).map((item) => item.quantity + "x " + item.name).join(", ")}</small></div>{statusFilter !== "finished" ? <button className="waiterFinishButton" onClick={() => updateStatus(order, "finished")}>✓ Finish Order</button> : null}</article>) : <p className="waiterEmpty">No {statusFilter} orders.</p>}
          </section>
        </aside>
      </div>
    </section>
  );
}
