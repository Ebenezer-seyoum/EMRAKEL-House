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

function ImageControl({ label, value, onChange, onUpload }) {
  const preview = value || brandImage;

  return (
    <div className="imageControl">
      <span>{label}</span>
      <img src={preview} alt="" />
      <div className="imageControlActions">
        <button className="button buttonLine compact" type="button" onClick={() => onChange("")}>
          Remove
        </button>
        <label className="button buttonDark compact">
          Upload
          <input accept="image/*" onChange={(event) => onUpload(event, onChange)} type="file" />
        </label>
      </div>
      <input value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder="/uploads/house/image.jpg" />
    </div>
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
  const [selectedMenuSide, setSelectedMenuSide] = useState("food");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [expandedSubsections, setExpandedSubsections] = useState([]);
  const [sectionSearch, setSectionSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
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
  const mainCategories = categories.filter((category) => !category.parentId);
  const selectedMainSection = mainCategories.find((category) => category.id === selectedSectionId) || null;
  const displayedMainCategories = mainCategories.filter((category) => (category.menuSide || "food") === selectedMenuSide);
  const filteredMainCategories = displayedMainCategories.filter((category) => {
    const query = sectionSearch.trim().toLowerCase();

    if (!query) {
      return true;
    }

    const children = categories.filter((item) => item.parentId === category.id);
    const haystack = [category, ...children]
      .map((item) => [item.id, item.name, item.description, item.menuSide].join(" "))
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("emrakelSession") || "null");
    setSession(saved);

    if (!saved || saved.role !== "admin") {
      setStatus({ type: "error", message: "Admin login is required. Use the login page first." });
      return;
    }

    loadDashboard();
  }, []);

  useEffect(() => {
    const visibleSections = categories.filter(
      (category) => !category.parentId && (category.menuSide || "food") === selectedMenuSide
    );

    if (!visibleSections.length) {
      setSelectedSectionId("");
      return;
    }

    if (!visibleSections.some((category) => category.id === selectedSectionId)) {
      setSelectedSectionId(visibleSections[0].id);
    }
  }, [categories, selectedMenuSide, selectedSectionId]);

  async function loadDashboard() {
    setStatus({ type: "", message: "Loading dashboard..." });
    const [settingsRes, menuRes, galleryRes, bookingsRes, ordersRes, customersRes, feedbackRes] = await Promise.all([
      fetch("/api/settings"),
      fetch("/api/menu", { headers: { "x-emrakel-role": "admin" } }),
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

  async function uploadAdminImage(event, onChange) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setStatus({ type: "", message: "Uploading image..." });
    const formData = new FormData();
    formData.append("file", file);

    let response;
    let data;

    try {
      response = await fetch("/api/uploads", {
        method: "POST",
        headers: { "x-emrakel-role": "admin" },
        body: formData
      });
      data = await response.json();
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Image upload failed." });
      event.target.value = "";
      return;
    }

    if (!response.ok) {
      setStatus({ type: "error", message: data.error || "Image upload failed." });
      event.target.value = "";
      return;
    }

    onChange(data.url);
    setStatus({ type: "success", message: "Image uploaded. Save this section to publish it." });
    event.target.value = "";
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

  function addCategory(parentId = "", menuSide = "food") {
    const parent = categories.find((category) => category.id === parentId);
    const resolvedSide = parent?.menuSide || menuSide;
    const id = parentId ? `subsection-${Date.now()}` : `section-${Date.now()}`;
    setCategories((current) => [
      ...current,
      {
        id,
        parentId,
        name: parentId ? "New Subsection" : "New Section",
        description: "",
        image: brandImage,
        menuSide: resolvedSide
      }
    ]);
    if (!parentId) {
      setSelectedMenuSide(resolvedSide);
      setSelectedSectionId(id);
    } else {
      setExpandedSubsections((current) => (current.includes(id) ? current : [...current, id]));
    }
  }

  function updateCategory(categoryId, updates) {
    const nextId = updates.id || categoryId;
    setCategories((current) =>
      current.map((category) => {
        if (category.id === categoryId) {
          return { ...category, ...updates };
        }
        if (category.parentId === categoryId) {
          return { ...category, parentId: nextId, ...(updates.menuSide ? { menuSide: updates.menuSide } : {}) };
        }
        return category;
      })
    );
    if (updates.id) {
      setItems((current) => current.map((item) => (item.category === categoryId ? { ...item, category: updates.id } : item)));
    }
  }

  function deleteCategory(categoryId) {
    const removedIds = categories
      .filter((category) => category.id === categoryId || category.parentId === categoryId)
      .map((category) => category.id);
    setCategories((current) => current.filter((category) => !removedIds.includes(category.id)));
    setItems((current) => current.filter((item) => !removedIds.includes(item.category)));
  }

  function moveCategory(categoryId, direction) {
    setCategories((current) => {
      const index = current.findIndex((category) => category.id === categoryId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }
      const next = [...current];
      const [category] = next.splice(index, 1);
      next.splice(nextIndex, 0, category);
      return next;
    });
  }

  function addMenuItem() {
    const targetCategory = selectedMainSection?.id || displayedMainCategories[0]?.id || categories[0]?.id || "burgers";

    setItems((current) => [
      ...current,
      {
        id: `item-${Date.now()}`,
        category: targetCategory,
        name: "New Item",
        description: "Item description",
        price: 0,
        isActive: true
      }
    ]);
    setExpandedSubsections((current) => (current.includes(targetCategory) ? current : [...current, targetCategory]));
  }

  function addMenuItemToCategory(categoryId) {
    setItems((current) => [
      ...current,
      {
        id: `item-${Date.now()}`,
        category: categoryId,
        name: "New Item",
        description: "Item description",
        price: 0,
        isActive: true
      }
    ]);
    setExpandedSubsections((current) => (current.includes(categoryId) ? current : [...current, categoryId]));
  }

  function toggleSubsection(categoryId) {
    setExpandedSubsections((current) =>
      current.includes(categoryId) ? current.filter((id) => id !== categoryId) : [...current, categoryId]
    );
  }

  function getCategoryItems(categoryId) {
    return items.filter((item) => item.category === categoryId);
  }

  function getVisibleCategoryItems(categoryId) {
    const query = itemSearch.trim().toLowerCase();

    return getCategoryItems(categoryId).filter((item) =>
      query ? [item.id, item.name, item.description, item.price].join(" ").toLowerCase().includes(query) : true
    );
  }

  function getNestedItemCount(categoryId) {
    const childIds = categories.filter((category) => category.parentId === categoryId).map((category) => category.id);

    return items.filter((item) => item.category === categoryId || childIds.includes(item.category)).length;
  }

  function renderMenuItemRows(categoryId) {
    const visibleItems = getVisibleCategoryItems(categoryId);

    return (
      <div className="menuItemRows">
        {visibleItems.length ? (
          visibleItems.map((item) => (
            <div className="menuItemRow" key={item.id}>
              <label>
                Item
                <input value={item.name} onChange={(event) => updateMenuItem(item.id, { name: event.target.value })} />
              </label>
              <label>
                Price
                <input
                  min="0"
                  type="number"
                  value={item.price}
                  onChange={(event) => updateMenuItem(item.id, { price: Number(event.target.value) })}
                />
              </label>
              <button
                className={`activeToggle ${item.isActive !== false ? "active" : ""}`}
                type="button"
                onClick={() => updateMenuItem(item.id, { isActive: item.isActive === false })}
              >
                {item.isActive !== false ? "Active" : "Hidden"}
              </button>
              <button className="button buttonLine compact dangerText" type="button" onClick={() => deleteMenuItem(item.id)}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="emptySmall">No items match this section yet.</p>
        )}
        <button className="button buttonLine compact" type="button" onClick={() => addMenuItemToCategory(categoryId)}>
          Add Item
        </button>
      </div>
    );
  }

  function renderSubsectionCard(subsection, parentCategory) {
    const expanded = expandedSubsections.includes(subsection.id);
    const itemCount = getCategoryItems(subsection.id).length;

    return (
      <article className="menuSubsectionCard" key={subsection.id}>
        <div className="menuSubsectionHead">
          <button className="menuDropdownButton" type="button" onClick={() => toggleSubsection(subsection.id)}>
            <span>{expanded ? "v" : ">"}</span>
          </button>
          <div>
            <strong>{subsection.name || "Untitled sub section"}</strong>
            <small>
              {itemCount} items - {subsection.menuSide === "drinks" ? "Drinks" : "Food"}
            </small>
          </div>
          <button
            className={`activeToggle ${subsection.isActive !== false ? "active" : ""}`}
            type="button"
            onClick={() => updateCategory(subsection.id, { isActive: subsection.isActive === false })}
          >
            {subsection.isActive !== false ? "Active" : "Hidden"}
          </button>
        </div>
        <div className="menuCategoryEditor menuSubsectionFields">
          <label>
            Key
            <input value={subsection.id} onChange={(event) => updateCategory(subsection.id, { id: event.target.value })} />
          </label>
          <label>
            Name
            <input value={subsection.name} onChange={(event) => updateCategory(subsection.id, { name: event.target.value })} />
          </label>
          <label>
            Menu side
            <select
              value={subsection.menuSide || parentCategory.menuSide || "food"}
              onChange={(event) => updateCategory(subsection.id, { menuSide: event.target.value })}
            >
              <option value="food">Food / Burger side</option>
              <option value="drinks">Drinks side</option>
            </select>
          </label>
          <label>
            Description
            <input
              value={subsection.description || ""}
              onChange={(event) => updateCategory(subsection.id, { description: event.target.value })}
            />
          </label>
          <div className="wideField">
            <ImageControl
              label="Sub section photo"
              value={subsection.image}
              onChange={(value) => updateCategory(subsection.id, { image: value })}
              onUpload={uploadAdminImage}
            />
          </div>
        </div>
        <div className="menuSubsectionActions">
          <button className="button buttonLine compact dangerText" type="button" onClick={() => deleteCategory(subsection.id)}>
            Delete Sub Section
          </button>
        </div>
        {expanded ? renderMenuItemRows(subsection.id) : null}
      </article>
    );
  }

  function updateMenuItem(itemId, updates) {
    setItems((current) => current.map((item) => (item.id === itemId ? { ...item, ...updates } : item)));
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

  function updateSocialLink(linkId, updates) {
    setFooter((current) => ({
      ...current,
      socialLinks: (current.socialLinks || []).map((link) => (link.id === linkId ? { ...link, ...updates } : link))
    }));
  }

  function addSocialLink() {
    const id = `social-${Date.now()}`;
    setFooter((current) => ({
      ...current,
      socialLinks: [
        ...(current.socialLinks || []),
        {
          id,
          name: "New Social Link",
          url: "#",
          image: "",
          enabled: true
        }
      ]
    }));
  }

  function deleteSocialLink(linkId) {
    setFooter((current) => ({
      ...current,
      socialLinks: (current.socialLinks || []).filter((link) => link.id !== linkId)
    }));
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
          <img src="/logo.png" alt="" />
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
            <TextInput
              label="Header kicker"
              value={home.headerKicker}
              onChange={(value) => setHome({ ...home, headerKicker: value })}
            />
            <TextInput
              label="Header title"
              value={home.headerTitle}
              onChange={(value) => setHome({ ...home, headerTitle: value })}
            />
            <TextInput label="Eyebrow" value={home.eyebrow} onChange={(value) => setHome({ ...home, eyebrow: value })} />
            <TextInput label="Headline" value={home.headline} onChange={(value) => setHome({ ...home, headline: value })} />
            <TextInput
              label="Description"
              textarea
              value={home.description}
              onChange={(value) => setHome({ ...home, description: value })}
            />
            <ImageControl
              label="Hero image"
              value={home.heroImage}
              onChange={(value) => setHome({ ...home, heroImage: value })}
              onUpload={uploadAdminImage}
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
            <TextInput
              label="Detail page back label"
              value={home.backHomeLabel}
              onChange={(value) => setHome({ ...home, backHomeLabel: value })}
            />
          </div>
          <div className="panel">
            <h2>Public Section Text</h2>
            <TextInput
              label="Menu page eyebrow"
              value={home.menuPageEyebrow}
              onChange={(value) => setHome({ ...home, menuPageEyebrow: value })}
            />
            <TextInput
              label="Menu page title"
              value={home.menuPageTitle}
              onChange={(value) => setHome({ ...home, menuPageTitle: value })}
            />
            <TextInput
              label="Menu page description"
              textarea
              value={home.menuPageDescription}
              onChange={(value) => setHome({ ...home, menuPageDescription: value })}
            />
            <ImageControl
              label="Menu page image"
              value={home.menuPageImage}
              onChange={(value) => setHome({ ...home, menuPageImage: value })}
              onUpload={uploadAdminImage}
            />
            <TextInput
              label="Menu view more label"
              value={home.menuViewMoreLabel}
              onChange={(value) => setHome({ ...home, menuViewMoreLabel: value })}
            />
            <TextInput
              label="Gallery eyebrow"
              value={home.galleryEyebrow}
              onChange={(value) => setHome({ ...home, galleryEyebrow: value })}
            />
            <TextInput
              label="Gallery headline"
              value={home.galleryHeadline}
              onChange={(value) => setHome({ ...home, galleryHeadline: value })}
            />
            <TextInput
              label="Gallery description"
              textarea
              value={home.galleryDescription}
              onChange={(value) => setHome({ ...home, galleryDescription: value })}
            />
            <TextInput
              label="Gallery view more label"
              value={home.galleryViewMoreLabel}
              onChange={(value) => setHome({ ...home, galleryViewMoreLabel: value })}
            />
            <TextInput
              label="About view more label"
              value={home.aboutViewMoreLabel}
              onChange={(value) => setHome({ ...home, aboutViewMoreLabel: value })}
            />
            <TextInput
              label="Contact view more label"
              value={home.contactViewMoreLabel}
              onChange={(value) => setHome({ ...home, contactViewMoreLabel: value })}
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
            <TextInput
              label="Story eyebrow"
              value={about.storyEyebrow}
              onChange={(value) => setAbout({ ...about, storyEyebrow: value })}
            />
            <TextInput
              label="Story headline"
              value={about.storyHeadline}
              onChange={(value) => setAbout({ ...about, storyHeadline: value })}
            />
            <TextInput
              label="Story description"
              textarea
              value={about.storyDescription}
              onChange={(value) => setAbout({ ...about, storyDescription: value })}
            />
            <TextInput
              label="Second block eyebrow"
              value={about.secondaryEyebrow}
              onChange={(value) => setAbout({ ...about, secondaryEyebrow: value })}
            />
            <TextInput
              label="Second block headline"
              value={about.secondaryHeadline}
              onChange={(value) => setAbout({ ...about, secondaryHeadline: value })}
            />
            <TextInput
              label="Second block description"
              textarea
              value={about.secondaryDescription}
              onChange={(value) => setAbout({ ...about, secondaryDescription: value })}
            />
          </div>
          <div className="panel">
            <h2>About Images</h2>
            <ImageControl
              label="Main image"
              value={about.image}
              onChange={(value) => setAbout({ ...about, image: value })}
              onUpload={uploadAdminImage}
            />
            <ImageControl
              label="Secondary image"
              value={about.secondaryImage}
              onChange={(value) => setAbout({ ...about, secondaryImage: value })}
              onUpload={uploadAdminImage}
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
            <TextInput
              label="Info eyebrow"
              value={contact.infoEyebrow}
              onChange={(value) => setContact({ ...contact, infoEyebrow: value })}
            />
            <TextInput
              label="Form eyebrow"
              value={contact.formEyebrow}
              onChange={(value) => setContact({ ...contact, formEyebrow: value })}
            />
            <TextInput
              label="Form headline"
              value={contact.formHeadline}
              onChange={(value) => setContact({ ...contact, formHeadline: value })}
            />
          </div>
          <div className="panel">
            <h2>Contact Image</h2>
            <ImageControl
              label="Contact image"
              value={contact.image}
              onChange={(value) => setContact({ ...contact, image: value })}
              onUpload={uploadAdminImage}
            />
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
          <div className="panel footerSocialEditorPanel">
            <div className="adminPanelHead">
              <div>
                <p className="eyebrow">Footer social media</p>
                <h2>Names, links, and logos</h2>
              </div>
              <button className="button buttonLine compact" type="button" onClick={addSocialLink}>
                Add Social Link
              </button>
            </div>
            <div className="footerSocialEditor">
              {(footer.socialLinks || []).map((link) => (
                <article className="footerSocialEditorCard" key={link.id}>
                  <label className="checkRow">
                    <input
                      checked={Boolean(link.enabled)}
                      onChange={(event) => updateSocialLink(link.id, { enabled: event.target.checked })}
                      type="checkbox"
                    />
                    Show in footer
                  </label>
                  <div className="footerSocialEditorFields">
                    <TextInput
                      label="Name"
                      value={link.name}
                      onChange={(value) => updateSocialLink(link.id, { name: value })}
                    />
                    <TextInput
                      label="Link"
                      value={link.url}
                      onChange={(value) => updateSocialLink(link.id, { url: value })}
                    />
                    <ImageControl
                      label="Logo image"
                      value={link.image}
                      onChange={(value) => updateSocialLink(link.id, { image: value })}
                      onUpload={uploadAdminImage}
                    />
                  </div>
                  <button className="button buttonLine compact" type="button" onClick={() => deleteSocialLink(link.id)}>
                    Delete Social Link
                  </button>
                </article>
              ))}
            </div>
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
            <TextInput label="Section name" value={jazz.title} onChange={(value) => setJazz({ ...jazz, title: value })} />
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
            <TextInput
              label="Action label"
              value={jazz.actionLabel}
              onChange={(value) => setJazz({ ...jazz, actionLabel: value })}
            />
            <ImageControl
              label="Jazz image"
              value={jazz.image}
              onChange={(value) => setJazz({ ...jazz, image: value })}
              onUpload={uploadAdminImage}
            />
          </div>
          <button className="button buttonGold" type="submit">
            Save Jazz Section
          </button>
        </form>
      ) : null}

      {activeTab === "menu" ? (
        <form className="adminStack" onSubmit={saveMenu}>
          <div className="panel menuWorkspaceHeader">
            <div className="adminPanelHead">
              <div>
                <p className="eyebrow">Menu workspace</p>
                <h2>Food and drinks sections</h2>
                <p className="contactText">
                  Pick Food or Drinks, select a main section, then expand sub sections to edit items and prices.
                </p>
              </div>
              <div className="menuSideSwitch" aria-label="Menu side">
                <button
                  className={selectedMenuSide === "food" ? "active" : ""}
                  onClick={() => setSelectedMenuSide("food")}
                  type="button"
                >
                  Food
                </button>
                <button
                  className={selectedMenuSide === "drinks" ? "active" : ""}
                  onClick={() => setSelectedMenuSide("drinks")}
                  type="button"
                >
                  Drinks
                </button>
              </div>
            </div>
            <div className="menuWorkspaceControls">
              <div className="menuAdminToolbar">
                <label>
                  Search sections
                  <input
                    value={sectionSearch}
                    onChange={(event) => setSectionSearch(event.target.value)}
                    placeholder="Search section or sub section"
                  />
                </label>
              </div>
              <button className="button buttonGold compact" type="button" onClick={() => addCategory("", selectedMenuSide)}>
                Add {selectedMenuSide === "drinks" ? "Drinks" : "Food"} Section
              </button>
            </div>
          </div>

          <div className="menuWorkspaceGrid">
            <aside className="panel menuSectionListPane">
              <div className="menuPaneTitle">
                <p className="eyebrow">{selectedMenuSide === "drinks" ? "Drinks side" : "Food side"}</p>
                <h2>Main sections</h2>
              </div>
              <div className="menuSectionList">
                {filteredMainCategories.length ? (
                  filteredMainCategories.map((category) => {
                    const subsectionCount = categories.filter((item) => item.parentId === category.id).length;
                    const itemCount = getNestedItemCount(category.id);

                    return (
                      <div
                        className={`menuSectionListRow ${selectedSectionId === category.id ? "active" : ""}`}
                        key={category.id}
                      >
                        <div className="menuSectionInfo" onClick={() => setSelectedSectionId(category.id)} role="button" tabIndex={0}>
                          <strong>{category.name || "Untitled section"}</strong>
                          <small>
                            {subsectionCount} sub / {itemCount} items
                          </small>
                        </div>

                        <div className="menuSectionActions">
                          <button
                            className="button buttonLine compact"
                            type="button"
                            onClick={() => setSelectedSectionId(category.id)}
                            aria-label={`View ${category.name || "section"}`}
                          >
                            View
                          </button>

                          <button
                            className={`activeToggle compact ${category.isActive !== false ? "active" : ""}`}
                            type="button"
                            onClick={() => updateCategory(category.id, { isActive: category.isActive === false })}
                            aria-pressed={category.isActive !== false}
                            aria-label={`${category.isActive !== false ? "Hide" : "Show"} ${category.name || "section"}`}
                          >
                            {category.isActive !== false ? "Active" : "Hidden"}
                          </button>

                          <button
                            className="button buttonLine compact dangerText"
                            type="button"
                            onClick={() => deleteCategory(category.id)}
                            aria-label={`Delete ${category.name || "section"}`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="emptySmall">No {selectedMenuSide} sections yet.</p>
                )}
              </div>
            </aside>

            <section className="panel menuSectionDetailPane">
              {selectedMainSection ? (
                <>
                  <div className="menuSectionDetailHeader">
                    <div>
                      <p className="eyebrow">Selected section</p>
                      <h2>{selectedMainSection.name || "Untitled section"}</h2>
                    </div>
                    <div className="miniActions">
                      <button
                        className={`activeToggle ${selectedMainSection.isActive !== false ? "active" : ""}`}
                        type="button"
                        onClick={() => updateCategory(selectedMainSection.id, { isActive: selectedMainSection.isActive === false })}
                      >
                        {selectedMainSection.isActive !== false ? "Active" : "Hidden"}
                      </button>
                      <button className="button buttonLine compact" type="button" onClick={() => moveCategory(selectedMainSection.id, -1)}>
                        Up
                      </button>
                      <button className="button buttonLine compact" type="button" onClick={() => moveCategory(selectedMainSection.id, 1)}>
                        Down
                      </button>
                      <button
                        className="button buttonLine compact dangerText"
                        type="button"
                        onClick={() => deleteCategory(selectedMainSection.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="menuSectionDetailGrid">
                    <label>
                      Section key
                      <input
                        value={selectedMainSection.id}
                        onChange={(event) => updateCategory(selectedMainSection.id, { id: event.target.value })}
                      />
                    </label>
                    <label>
                      Section name
                      <input
                        value={selectedMainSection.name}
                        onChange={(event) => updateCategory(selectedMainSection.id, { name: event.target.value })}
                      />
                    </label>
                    <label>
                      Menu side
                      <select
                        value={selectedMainSection.menuSide || "food"}
                        onChange={(event) => {
                          setSelectedMenuSide(event.target.value);
                          updateCategory(selectedMainSection.id, { menuSide: event.target.value });
                        }}
                      >
                        <option value="food">Food / Burger side</option>
                        <option value="drinks">Drinks side</option>
                      </select>
                    </label>
                    <label className="wideField">
                      Description
                      <textarea
                        value={selectedMainSection.description || ""}
                        onChange={(event) => updateCategory(selectedMainSection.id, { description: event.target.value })}
                      />
                    </label>
                    <div className="wideField">
                      <ImageControl
                        label="Main section photo"
                        value={selectedMainSection.image}
                        onChange={(value) => updateCategory(selectedMainSection.id, { image: value })}
                        onUpload={uploadAdminImage}
                      />
                    </div>
                  </div>

                  <div className="menuSubsectionWorkspace">
                    <div className="adminPanelHead compactHead">
                      <div>
                        <p className="eyebrow">Sub sections</p>
                        <h3>Dropdown items with prices</h3>
                      </div>
                      <div className="miniActions">
                        <input
                          className="compactSearch"
                          value={itemSearch}
                          onChange={(event) => setItemSearch(event.target.value)}
                          placeholder="Search items..."
                        />
                        <button
                          className="button buttonLine compact"
                          type="button"
                          onClick={() => addCategory(selectedMainSection.id, selectedMainSection.menuSide || "food")}
                        >
                          Add Sub Section
                        </button>
                      </div>
                    </div>
                    {categories.filter((category) => category.parentId === selectedMainSection.id).length ? (
                      categories
                        .filter((category) => category.parentId === selectedMainSection.id)
                        .map((subsection) => renderSubsectionCard(subsection, selectedMainSection))
                    ) : (
                      <article className="menuSubsectionCard">
                        <div className="menuSubsectionHead">
                          <button
                            className="menuDropdownButton"
                            type="button"
                            onClick={() => toggleSubsection(selectedMainSection.id)}
                          >
                            <span>{expandedSubsections.includes(selectedMainSection.id) ? "v" : ">"}</span>
                          </button>
                          <div>
                            <strong>{selectedMainSection.name || "Section"} items</strong>
                            <small>{getCategoryItems(selectedMainSection.id).length} direct items</small>
                          </div>
                          <button className="button buttonLine compact" type="button" onClick={addMenuItem}>
                            Add Direct Item
                          </button>
                        </div>
                        {expandedSubsections.includes(selectedMainSection.id) ? renderMenuItemRows(selectedMainSection.id) : null}
                      </article>
                    )}
                  </div>
                </>
              ) : (
                <div className="emptyAdminState">
                  <p className="eyebrow">No section selected</p>
                  <h2>Add a {selectedMenuSide === "drinks" ? "drinks" : "food"} section to begin.</h2>
                </div>
              )}
            </section>
          </div>

          <div className="actions">
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
                <img className="adminPanelImage" src={image.image || brandImage} alt="" />
                <TextInput
                  label="Title"
                  value={image.title}
                  onChange={(value) =>
                    setGallery((current) =>
                      current.map((item, itemIndex) => (itemIndex === index ? { ...item, title: value } : item))
                    )
                  }
                />
                <ImageControl
                  label="Gallery image"
                  value={image.image}
                  onChange={(value) =>
                    setGallery((current) =>
                      current.map((item, itemIndex) => (itemIndex === index ? { ...item, image: value } : item))
                    )
                  }
                  onUpload={uploadAdminImage}
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
