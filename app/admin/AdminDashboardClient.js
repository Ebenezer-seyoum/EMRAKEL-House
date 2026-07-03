"use client";

import { useEffect, useMemo, useState } from "react";
import { brandImage } from "@/lib/data";

const emptyStatus = { type: "", message: "" };
const navItems = [
  ["home", "Home"],
  ["menu", "Menu"],
  ["gallery", "Gallery"],
  ["about", "About Us"],
  ["contact", "Contact"],
  ["footer", "Footer"],
  ["orders", "Orders"],
  ["bookings", "Book Tables"],
  ["customers", "Customers"],
  ["feedback", "Feedback"],
  ["jazz", "Jazz"]
];

function adminHeaders() {
  return {
    "Content-Type": "application/json",
    "x-emrakel-role": "admin"
  };
}

function TextInput({ label, value, onChange, textarea = false, type = "text" }) {
  const Field = textarea ? "textarea" : "input";
  return (
    <label>
      {label}
      <Field type={textarea ? undefined : type} value={value || ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export default function AdminDashboardClient() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [status, setStatus] = useState(emptyStatus);
  const [brand, setBrand] = useState(null);
  const [home, setHome] = useState(null);
  const [about, setAbout] = useState(null);
  const [contact, setContact] = useState(null);
  const [footer, setFooter] = useState(null);
  const [jazz, setJazz] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const totals = useMemo(
    () => ({
      pendingBookings: bookings.filter((booking) => booking.status === "pending").length,
      pendingOrders: orders.filter((order) => order.status === "pending").length,
      menuItems: items.length,
      totalOrders: orders.length,
      totalBookings: bookings.length,
      customers: customers.length,
      newFeedback: feedback.filter((item) => item.status === "new").length,
      revenue: orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0)
    }),
    [bookings, customers, feedback, items, orders]
  );

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("emrakelSession") || "null");
    setSession(saved);

    if (!saved || saved.role !== "admin") {
      setStatus({ type: "error", message: "Admin login is required. Use the login page first." });
      return;
    }

    loadDashboard();
  }, []);

  async function loadDashboard() {
    setStatus({ type: "", message: "Loading dashboard..." });
    const [settingsRes, menuRes, galleryRes, bookingsRes, ordersRes, customersRes, feedbackRes] = await Promise.all([
      fetch("/api/settings"),
      fetch("/api/menu"),
      fetch("/api/gallery"),
      fetch("/api/bookings", { headers: { "x-emrakel-role": "admin" } }),
      fetch("/api/orders", { headers: { "x-emrakel-role": "admin" } }),
      fetch("/api/customers", { headers: { "x-emrakel-role": "admin" } }),
      fetch("/api/feedback", { headers: { "x-emrakel-role": "admin" } })
    ]);

    const [settingsData, menuData, galleryData, bookingsData, ordersData, customersData, feedbackData] = await Promise.all([
      settingsRes.json(),
      menuRes.json(),
      galleryRes.json(),
      bookingsRes.json(),
      ordersRes.json(),
      customersRes.json(),
      feedbackRes.json()
    ]);

    setBrand(settingsData.brand);
    setHome(settingsData.home);
    setAbout(settingsData.about);
    setContact(settingsData.contact);
    setFooter(settingsData.footer);
    setJazz(settingsData.jazz);
    setCategories(menuData.categories || []);
    setItems(menuData.items || []);
    setGallery(galleryData.gallery || []);
    setBookings(bookingsData.bookings || []);
    setOrders(ordersData.orders || []);
    setCustomers(customersData.customers || []);
    setFeedback(feedbackData.feedback || []);
    setStatus(emptyStatus);
  }

  async function saveSettings(event) {
    event.preventDefault();
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: adminHeaders(),
      body: JSON.stringify({ brand, home, about, contact, footer, jazz })
    });
    const data = await response.json();
    setStatus({ type: response.ok ? "success" : "error", message: data.message || data.error });
  }

  async function saveMenu(event) {
    event.preventDefault();
    const response = await fetch("/api/menu", {
      method: "PUT",
      headers: adminHeaders(),
      body: JSON.stringify({ categories, items })
    });
    const data = await response.json();
    setStatus({ type: response.ok ? "success" : "error", message: data.message || data.error });
  }

  async function saveGallery(event) {
    event.preventDefault();
    const response = await fetch("/api/gallery", {
      method: "PUT",
      headers: adminHeaders(),
      body: JSON.stringify({ gallery })
    });
    const data = await response.json();
    setStatus({ type: response.ok ? "success" : "error", message: data.message || data.error });
  }

  async function updateBooking(id, nextStatus) {
    const response = await fetch("/api/bookings", {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ id, status: nextStatus })
    });
    const data = await response.json();
    setStatus({ type: response.ok ? "success" : "error", message: data.message || data.error });
    await loadDashboard();
  }

  async function updateOrder(id, nextStatus) {
    const response = await fetch("/api/orders", {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ id, status: nextStatus })
    });
    const data = await response.json();
    setStatus({ type: response.ok ? "success" : "error", message: data.message || data.error });
    await loadDashboard();
  }

  async function updateFeedback(id, nextStatus) {
    const response = await fetch("/api/feedback", {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ id, status: nextStatus })
    });
    const data = await response.json();
    setStatus({ type: response.ok ? "success" : "error", message: data.message || data.error });
    await loadDashboard();
  }

  function addCategory(parentId = "") {
    const id = parentId ? `subsection-${Date.now()}` : `section-${Date.now()}`;
    setCategories((current) => [
      ...current,
      {
        id,
        parentId,
        name: parentId ? "New Subsection" : "New Section",
        description: ""
      }
    ]);
  }

  function deleteCategory(categoryId) {
    setCategories((current) => current.filter((category) => category.id !== categoryId && category.parentId !== categoryId));
    setItems((current) => current.filter((item) => item.category !== categoryId));
  }

  function addMenuItem() {
    setItems((current) => [
      ...current,
      {
        id: `item-${Date.now()}`,
        category: categories[0]?.id || "burgers",
        name: "New Item",
        description: "Item description",
        price: 0,
        image: brandImage
      }
    ]);
  }

  function deleteMenuItem(itemId) {
    setItems((current) => current.filter((item) => item.id !== itemId));
  }

  function addGalleryImage() {
    setGallery((current) => [
      ...current,
      {
        id: `gallery-${Date.now()}`,
        title: "Gallery image",
        image: brandImage
      }
    ]);
  }

  function deleteGalleryImage(imageId) {
    setGallery((current) => current.filter((image) => image.id !== imageId));
  }

  function logout() {
    localStorage.removeItem("emrakelSession");
    window.location.href = "/login";
  }

  if (!session || session.role !== "admin") {
    return (
      <section className="adminAuthState">
        <div className="panel">
          <h2>Admin login required</h2>
          <p className="contactText">Go to Login and sign in as admin to manage this dashboard.</p>
        </div>
      </section>
    );
  }

  if (!brand || !home || !about || !contact || !footer || !jazz) {
    return (
      <section className="adminAuthState">
        <div className="panel">
          <h2>Loading dashboard</h2>
          <p className="contactText">Preparing admin controls.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="adminShell">
      <aside className="adminSidebar">
        <div className="adminBrandBlock">
          <img src="/logo.jpg" alt="" />
          <div>
            <strong>EMRAKEL</strong>
            <span>Admin console</span>
          </div>
        </div>
        <nav className="adminSideNav" aria-label="Admin sections">
          {navItems.map(([id, label]) => (
            <button className={activeTab === id ? "active" : ""} key={id} onClick={() => setActiveTab(id)} type="button">
              <span>{label}</span>
              {id === "bookings" && totals.pendingBookings ? <small>{totals.pendingBookings}</small> : null}
              {id === "orders" && totals.pendingOrders ? <small>{totals.pendingOrders}</small> : null}
              {id === "feedback" && totals.newFeedback ? <small>{totals.newFeedback}</small> : null}
            </button>
          ))}
        </nav>
        <div className="adminSidebarFooter">
          <span>Signed in</span>
          <strong>{session.name}</strong>
          <button className="button buttonLine compact" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <div className="adminMain">
        <header className="adminTopbar">
          <div>
            <p className="eyebrow">Restaurant operations</p>
            <h1>Dashboard</h1>
            <p>Manage content, menu items, reservations, and online orders from one workspace.</p>
          </div>
          <div className="adminTopActions">
            <button className="button buttonLine compact" type="button" onClick={loadDashboard}>
              Refresh
            </button>
            <a className="button buttonDark compact" href="/" target="_blank">
              View Site
            </a>
          </div>
        </header>

        <div className="metricGrid">
          <div className="adminMetricCard">
            <span>Pending orders</span>
            <strong>{totals.pendingOrders}</strong>
            <small>{totals.totalOrders} total orders</small>
          </div>
          <div className="adminMetricCard">
            <span>Pending bookings</span>
            <strong>{totals.pendingBookings}</strong>
            <small>{totals.totalBookings} total bookings</small>
          </div>
          <div className="adminMetricCard">
            <span>Customers</span>
            <strong>{totals.customers}</strong>
            <small>registered accounts</small>
          </div>
          <div className="adminMetricCard">
            <span>New feedback</span>
            <strong>{totals.newFeedback}</strong>
            <small>{totals.menuItems} menu items</small>
          </div>
        </div>

        <div className="adminContentHeader">
          <div>
            <p className="eyebrow">Current section</p>
            <h2>{navItems.find(([id]) => id === activeTab)?.[1]}</h2>
          </div>
          {status.message ? <p className={`adminStatus ${status.type}`}>{status.message}</p> : null}
        </div>

      {activeTab === "home" ? (
        <form className="adminForm" onSubmit={saveSettings}>
          <div className="panel">
            <h2>Brand</h2>
            <TextInput label="Name" value={brand.name} onChange={(value) => setBrand({ ...brand, name: value })} />
            <TextInput
              label="Subtitle"
              value={brand.subtitle}
              onChange={(value) => setBrand({ ...brand, subtitle: value })}
            />
            <TextInput label="Phone" value={brand.phone} onChange={(value) => setBrand({ ...brand, phone: value })} />
            <TextInput label="Email" value={brand.email} onChange={(value) => setBrand({ ...brand, email: value })} />
            <TextInput
              label="Address"
              value={brand.address}
              onChange={(value) => setBrand({ ...brand, address: value })}
            />
            <TextInput label="Hours" value={brand.hours} onChange={(value) => setBrand({ ...brand, hours: value })} />
          </div>
          <div className="panel">
            <h2>Homepage</h2>
            <TextInput label="Eyebrow" value={home.eyebrow} onChange={(value) => setHome({ ...home, eyebrow: value })} />
            <TextInput label="Headline" value={home.headline} onChange={(value) => setHome({ ...home, headline: value })} />
            <TextInput
              label="Description"
              textarea
              value={home.description}
              onChange={(value) => setHome({ ...home, description: value })}
            />
            <TextInput
              label="Hero image URL"
              value={home.heroImage}
              onChange={(value) => setHome({ ...home, heroImage: value })}
            />
            <TextInput
              label="Primary button"
              value={home.primaryAction}
              onChange={(value) => setHome({ ...home, primaryAction: value })}
            />
            <TextInput
              label="Secondary button"
              value={home.secondaryAction}
              onChange={(value) => setHome({ ...home, secondaryAction: value })}
            />
          </div>
          <button className="button buttonGold" type="submit">
            Save Homepage
          </button>
        </form>
      ) : null}

      {activeTab === "about" ? (
        <form className="adminForm" onSubmit={saveSettings}>
          <div className="panel">
            <h2>About Page</h2>
            <TextInput label="Eyebrow" value={about.eyebrow} onChange={(value) => setAbout({ ...about, eyebrow: value })} />
            <TextInput label="Headline" value={about.headline} onChange={(value) => setAbout({ ...about, headline: value })} />
            <TextInput
              label="Description"
              textarea
              value={about.description}
              onChange={(value) => setAbout({ ...about, description: value })}
            />
          </div>
          <div className="panel">
            <h2>About Images</h2>
            <TextInput label="Main image URL" value={about.image} onChange={(value) => setAbout({ ...about, image: value })} />
            <TextInput
              label="Secondary image URL"
              value={about.secondaryImage}
              onChange={(value) => setAbout({ ...about, secondaryImage: value })}
            />
          </div>
          <button className="button buttonGold" type="submit">
            Save About Page
          </button>
        </form>
      ) : null}

      {activeTab === "contact" ? (
        <form className="adminForm" onSubmit={saveSettings}>
          <div className="panel">
            <h2>Contact Page</h2>
            <TextInput label="Eyebrow" value={contact.eyebrow} onChange={(value) => setContact({ ...contact, eyebrow: value })} />
            <TextInput
              label="Headline"
              value={contact.headline}
              onChange={(value) => setContact({ ...contact, headline: value })}
            />
            <TextInput
              label="Description"
              textarea
              value={contact.description}
              onChange={(value) => setContact({ ...contact, description: value })}
            />
          </div>
          <div className="panel">
            <h2>Contact Image</h2>
            <TextInput label="Image URL" value={contact.image} onChange={(value) => setContact({ ...contact, image: value })} />
          </div>
          <button className="button buttonGold" type="submit">
            Save Contact Page
          </button>
        </form>
      ) : null}

      {activeTab === "footer" ? (
        <form className="adminForm" onSubmit={saveSettings}>
          <div className="panel">
            <h2>Footer Content</h2>
            <TextInput
              label="Copyright"
              value={footer.copyright}
              onChange={(value) => setFooter({ ...footer, copyright: value })}
            />
            <TextInput label="Credit note" value={footer.note} onChange={(value) => setFooter({ ...footer, note: value })} />
          </div>
          <div className="panel">
            <h2>Brand Contact</h2>
            <TextInput label="Phone" value={brand.phone} onChange={(value) => setBrand({ ...brand, phone: value })} />
            <TextInput label="Email" value={brand.email} onChange={(value) => setBrand({ ...brand, email: value })} />
            <TextInput
              label="Address"
              value={brand.address}
              onChange={(value) => setBrand({ ...brand, address: value })}
            />
            <TextInput label="Hours" value={brand.hours} onChange={(value) => setBrand({ ...brand, hours: value })} />
          </div>
          <button className="button buttonGold" type="submit">
            Save Footer
          </button>
        </form>
      ) : null}

      {activeTab === "jazz" ? (
        <form className="adminForm" onSubmit={saveSettings}>
          <div className="panel">
            <h2>Jazz Section</h2>
            <label className="checkRow">
              <input
                checked={Boolean(jazz.enabled)}
                onChange={(event) => setJazz({ ...jazz, enabled: event.target.checked })}
                type="checkbox"
              />
              Show section on home page
            </label>
            <TextInput label="Eyebrow" value={jazz.eyebrow} onChange={(value) => setJazz({ ...jazz, eyebrow: value })} />
            <TextInput label="Title" value={jazz.title} onChange={(value) => setJazz({ ...jazz, title: value })} />
            <TextInput
              label="Description"
              textarea
              value={jazz.description}
              onChange={(value) => setJazz({ ...jazz, description: value })}
            />
          </div>
          <div className="panel">
            <h2>Date and Image</h2>
            <TextInput label="Date" value={jazz.date} onChange={(value) => setJazz({ ...jazz, date: value })} />
            <TextInput label="Time" value={jazz.time} onChange={(value) => setJazz({ ...jazz, time: value })} />
            <TextInput label="Image URL" value={jazz.image} onChange={(value) => setJazz({ ...jazz, image: value })} />
          </div>
          <button className="button buttonGold" type="submit">
            Save Jazz Section
          </button>
        </form>
      ) : null}

      {activeTab === "menu" ? (
        <form className="adminStack" onSubmit={saveMenu}>
          <div className="panel">
            <div className="adminPanelHead">
              <h2>Menu Sections</h2>
              <button className="button buttonLine compact" type="button" onClick={() => addCategory("")}>
                Add Section
              </button>
            </div>
            {categories.map((category, index) => (
              <div className="menuCategoryEditor" key={category.id}>
                <input
                  aria-label="Section key"
                  value={category.id}
                  onChange={(event) =>
                    setCategories((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, id: event.target.value } : item
                      )
                    )
                  }
                />
                <select
                  aria-label="Parent section"
                  value={category.parentId || ""}
                  onChange={(event) =>
                    setCategories((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, parentId: event.target.value } : item
                      )
                    )
                  }
                >
                  <option value="">Main section</option>
                  {categories
                    .filter((item) => item.id !== category.id && !item.parentId)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        Under {item.name}
                      </option>
                    ))}
                </select>
                <input
                  aria-label="Section name"
                  value={category.name}
                  onChange={(event) =>
                    setCategories((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, name: event.target.value } : item
                      )
                    )
                  }
                />
                <input
                  aria-label="Section description"
                  placeholder="Description"
                  value={category.description || ""}
                  onChange={(event) =>
                    setCategories((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, description: event.target.value } : item
                      )
                    )
                  }
                />
                <button className="button buttonLine compact" type="button" onClick={() => addCategory(category.id)}>
                  Add Subsection
                </button>
                <button className="button buttonLine compact" type="button" onClick={() => deleteCategory(category.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="adminTableWrap">
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Image URL</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        value={item.name}
                        onChange={(event) =>
                          setItems((current) =>
                            current.map((row, rowIndex) =>
                              rowIndex === index ? { ...row, name: event.target.value } : row
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={item.category}
                        onChange={(event) =>
                          setItems((current) =>
                            current.map((row, rowIndex) =>
                              rowIndex === index ? { ...row, category: event.target.value } : row
                            )
                          )
                        }
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(event) =>
                          setItems((current) =>
                            current.map((row, rowIndex) =>
                              rowIndex === index ? { ...row, price: Number(event.target.value) } : row
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={item.image}
                        onChange={(event) =>
                          setItems((current) =>
                            current.map((row, rowIndex) =>
                              rowIndex === index ? { ...row, image: event.target.value } : row
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <textarea
                        value={item.description}
                        onChange={(event) =>
                          setItems((current) =>
                            current.map((row, rowIndex) =>
                              rowIndex === index ? { ...row, description: event.target.value } : row
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <button className="button buttonLine compact" type="button" onClick={() => deleteMenuItem(item.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="actions">
            <button className="button buttonLine" type="button" onClick={addMenuItem}>
              Add Item
            </button>
            <button className="button buttonGold" type="submit">
              Save Menu
            </button>
          </div>
        </form>
      ) : null}

      {activeTab === "gallery" ? (
        <form className="adminStack" onSubmit={saveGallery}>
          <div className="cardGrid">
            {gallery.map((image, index) => (
              <div className="panel" key={image.id}>
                <img className="adminPanelImage" src={image.image} alt="" />
                <TextInput
                  label="Title"
                  value={image.title}
                  onChange={(value) =>
                    setGallery((current) =>
                      current.map((item, itemIndex) => (itemIndex === index ? { ...item, title: value } : item))
                    )
                  }
                />
                <TextInput
                  label="Image URL"
                  value={image.image}
                  onChange={(value) =>
                    setGallery((current) =>
                      current.map((item, itemIndex) => (itemIndex === index ? { ...item, image: value } : item))
                    )
                  }
                />
                <button className="button buttonLine compact" type="button" onClick={() => deleteGalleryImage(image.id)}>
                  Delete Image
                </button>
              </div>
            ))}
          </div>
          <div className="actions">
            <button className="button buttonLine" type="button" onClick={addGalleryImage}>
              Add Image
            </button>
            <button className="button buttonGold" type="submit">
              Save Gallery
            </button>
          </div>
        </form>
      ) : null}

      {activeTab === "bookings" ? (
        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.customer_name}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.booking_date}</td>
                  <td>{booking.booking_time}</td>
                  <td>{booking.guests}</td>
                  <td>
                    <select value={booking.status} onChange={(event) => updateBooking(booking.id, event.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {activeTab === "customers" ? (
        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id || customer.email}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || "-"}</td>
                  <td>{customer.role}</td>
                  <td>{customer.created_at ? new Date(customer.created_at).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {activeTab === "feedback" ? (
        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Contact</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <p>{item.phone || "-"}</p>
                    <p>{item.email || "-"}</p>
                  </td>
                  <td>{item.subject || "Website feedback"}</td>
                  <td>{item.message}</td>
                  <td>
                    <select value={item.status} onChange={(event) => updateFeedback(item.id, event.target.value)}>
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {activeTab === "orders" ? (
        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Total</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.customer_name}</td>
                  <td>{order.phone}</td>
                  <td>{(order.items || order.order_items || []).map((item) => `${item.quantity}x ${item.name}`).join(", ")}</td>
                  <td>{order.total_amount} ETB</td>
                  <td>{order.order_type}</td>
                  <td>
                    <select value={order.status} onChange={(event) => updateOrder(order.id, event.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      </div>
    </section>
  );
}
