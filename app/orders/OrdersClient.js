"use client";

import { useEffect, useMemo, useState } from "react";
import { menuCategories, menuItems } from "@/lib/data";

const money = (value) => Number(value || 0).toLocaleString() + " ETB";

export default function OrdersClient() {
  const [table, setTable] = useState("1");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [liveCategories, setLiveCategories] = useState(menuCategories);
  const [liveItems, setLiveItems] = useState(menuItems);
  const [menuUpdated, setMenuUpdated] = useState(false);
  const visibleItems = useMemo(() => liveItems.filter((item) => item.isActive !== false && (category === "all" || item.category === category)), [category, liveItems]);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const add = (item) => setCart((current) => current.some((line) => line.id === item.id) ? current.map((line) => line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { ...item, quantity: 1 }]);
  const change = (id, delta) => setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  const loadMenu = async () => { const response = await fetch("/api/menu", { cache: "no-store" }); if (response.ok) { const data = await response.json(); if (Array.isArray(data.categories) && Array.isArray(data.items)) { setLiveCategories(data.categories); setLiveItems(data.items); setMenuUpdated(true); } } };
  const loadOrders = async () => { const response = await fetch("/api/orders", { headers: { "x-emrakel-role": "admin" } }); if (response.ok) setOrders((await response.json()).orders || []); };
  const submit = async () => {
    if (!cart.length) return;
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json", "x-emrakel-role": "admin" }, body: JSON.stringify({ customer_name: "Table " + table, phone: "in-person", order_type: "dine-in", table_number: table, items: cart.map((item) => ({ name: item.name, quantity: item.quantity, unit_price: item.price })), total_amount: total }) });
    if (response.ok) { setMessage("Order sent for Table " + table); setCart([]); loadOrders(); }
  };
  useEffect(() => { loadMenu(); loadOrders(); const timer = window.setInterval(loadMenu, 30000); return () => window.clearInterval(timer); }, []);
  return <section className="operationsPage"><div className="operationsHeader"><div><p className="eyebrow">Waiter tablet</p><h1>Take an order</h1><p>Select a table, add menu items, and send the order to the kitchen.</p>{menuUpdated && <span className="successText">Live menu loaded from admin</span>}</div><label>Table<select value={table} onChange={(e) => setTable(e.target.value)}>{Array.from({ length: 10 }, (_, i) => <option key={i + 1}>{i + 1}</option>)}</select></label></div><div className="operationsGrid"><div><div className="filterPills"><button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>All</button>{liveCategories.filter((item) => !item.parentId && item.isActive !== false).map((item) => <button key={item.id} className={category === item.id ? "active" : ""} onClick={() => setCategory(item.id)}>{item.name}</button>)}</div><div className="orderMenuGrid">{visibleItems.map((item) => <article className="orderMenuCard" key={item.id}><img src={item.image || "/logo.png"} alt="" /><div><h3>{item.name}</h3><p>{item.description}</p><strong>{money(item.price)}</strong><button className="button buttonGold compact" onClick={() => add(item)}>Add to order</button></div></article>)}</div></div><aside className="orderCart panel"><p className="eyebrow">Table {table}</p><h2>Current order</h2>{cart.length ? cart.map((item) => <div className="orderLine" key={item.id}><div><strong>{item.name}</strong><span>{money(item.price)} each</span></div><div className="quantityControl"><button onClick={() => change(item.id, -1)}>-</button><b>{item.quantity}</b><button onClick={() => change(item.id, 1)}>+</button></div></div>) : <p className="mutedText">No items added yet.</p>}<div className="orderTotal"><span>Total</span><strong>{money(total)}</strong></div><button className="button buttonGold fullButton" disabled={!cart.length} onClick={submit}>Send order</button>{message && <p className="successText">{message}</p>}</aside></div><div className="panel recentOrders"><div className="adminPanelHead"><div><p className="eyebrow">Live queue</p><h2>Recent orders</h2></div><button className="button buttonLine compact" onClick={() => { loadMenu(); loadOrders(); }}>Refresh</button></div>{orders.slice(0, 8).map((order) => <div className="orderQueueRow" key={order.id}><span>{order.customer_name}</span><span>{money(order.total_amount)}</span><span className="statusBadge">{order.status}</span></div>)}</div></section>;
}

