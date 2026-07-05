export const brand = {
  name: "EMRAKEL",
  subtitle: "Burger, Pizza & Cocktail House",
  phone: "+251 900 000 000",
  email: "hello@emrakel.house",
  address: "Addis Ababa, Ethiopia",
  hours: "Mon - Sun, 10:00 AM - 11:30 PM"
};

export const homeSettings = {
  eyebrow: "Black and white burger house",
  headline: "EMRAKEL Burger, Pizza & Cocktail House",
  description:
    "A modern burger house with a sharp black-and-white identity, premium comfort food, and a clean visual system ready for future admin-managed menu photos.",
  primaryAction: "Book a Table",
  secondaryAction: "View Menu"
};

export const brandImage = "/logo.png";

export const houseImages = [
  "/uploads/house/interior-01.jpg",
  "/uploads/house/interior-02.jpg",
  "/uploads/house/interior-03.jpg",
  "/uploads/house/interior-04.jpg",
  "/uploads/house/interior-05.jpg",
  "/uploads/house/interior-06.jpg",
  "/uploads/house/interior-07.jpg",
  "/uploads/house/interior-08.jpg",
  "/uploads/house/interior-09.jpg",
  "/uploads/house/interior-10.jpg",
  "/uploads/house/interior-11.jpg"
];

export const menuCategories = [
  { id: "food", name: "Food", parentId: "", description: "Burgers, pizza, sandwiches, and shawarma", image: "/uploads/house/menu-board-reference.jpg" },
  { id: "burgers", name: "Burgers", parentId: "food", description: "House-grilled signatures", image: "/uploads/house/menu-board-reference.jpg" },
  { id: "pizza", name: "Pizza", parentId: "food", description: "Hot house pizza", image: "/uploads/house/menu-board-reference.jpg" },
  { id: "sandwiches", name: "Sandwiches", parentId: "food", description: "Toasted house sandwiches", image: "/uploads/house/menu-board-reference.jpg" },
  { id: "shawarma", name: "Shawarma", parentId: "food", description: "Wrapped house favorites", image: "/uploads/house/menu-board-reference.jpg" },
  { id: "drinks", name: "Drinks", parentId: "", description: "Refreshments and cocktails", image: "/uploads/house/menu-board-reference.jpg" },
  { id: "shakes", name: "Shakes", parentId: "drinks", description: "Creamy milkshakes", image: "/uploads/house/menu-board-reference.jpg" },
  { id: "mojito", name: "Mojito", parentId: "drinks", description: "Fresh mojito mixes", image: "/uploads/house/menu-board-reference.jpg" },
  { id: "cocktails", name: "Alcoholic Cocktails", parentId: "drinks", description: "House cocktail selection", image: "/uploads/house/menu-board-reference.jpg" }
];

export const menuItems = [
  {
    id: "classic-burger",
    category: "burgers",
    name: "Special Burger",
    description: "House burger with beef, sauce, fresh garnish, and toasted bun.",
    price: 900,
    image: "/uploads/house/menu-board-reference.jpg"
  },
  {
    id: "smoky-double",
    category: "burgers",
    name: "Double Beef Burger",
    description: "Double beef, house sauce, lettuce, cheese, and sesame bun.",
    price: 850,
    image: "/uploads/house/menu-board-reference.jpg"
  },
  {
    id: "golden-margherita",
    category: "pizza",
    name: "Special Pizza",
    description: "Cheese pull, house tomato base, and premium toppings.",
    price: 900,
    image: "/uploads/house/menu-board-reference.jpg"
  },
  {
    id: "pepperoni-fire",
    category: "pizza",
    name: "Meat Lover Pizza",
    description: "Meat toppings, mozzarella, oregano, and rich house sauce.",
    price: 800,
    image: "/uploads/house/menu-board-reference.jpg"
  },
  {
    id: "citrus-gold",
    category: "shakes",
    name: "Strawberry Milkshake",
    description: "Cold milkshake with strawberry flavor and creamy finish.",
    price: 350,
    image: "/uploads/house/menu-board-reference.jpg"
  },
  {
    id: "ember-martini",
    category: "mojito",
    name: "Orange Mojito",
    description: "Fresh orange mojito with mint and citrus.",
    price: 400,
    image: "/uploads/house/menu-board-reference.jpg"
  },
  {
    id: "chicken-sandwich",
    category: "sandwiches",
    name: "Chicken Sandwich",
    description: "Toasted sandwich with chicken, sauce, and crisp garnish.",
    price: 700,
    image: "/uploads/house/menu-board-reference.jpg"
  },
  {
    id: "special-shawarma",
    category: "shawarma",
    name: "Special Shawarma",
    description: "Warm wrap with seasoned filling and house sauce.",
    price: 950,
    image: "/uploads/house/menu-board-reference.jpg"
  },
  {
    id: "house-cocktail",
    category: "cocktails",
    name: "House Cocktail",
    description: "Signature alcoholic cocktail served with fresh garnish.",
    price: 450,
    image: "/uploads/house/menu-board-reference.jpg"
  }
];

export const galleryImages = [
  "/uploads/house/interior-03.jpg",
  "/uploads/house/interior-08.jpg",
  "/uploads/house/interior-05.jpg",
  "/uploads/house/interior-11.jpg"
];

export const aboutSettings = {
  eyebrow: "About EMRAKEL",
  headline: "A warm burger house shaped by murals, lights, plants, and evening energy.",
  description:
    "EMRAKEL blends burger, pizza, cocktail, and lounge culture inside a distinctive house interior with hand-painted walls, warm chandeliers, dark marble counters, and green ceiling details.",
  image: "/uploads/house/interior-05.jpg",
  secondaryImage: "/uploads/house/interior-11.jpg"
};

export const contactSettings = {
  eyebrow: "Contact",
  headline: "Visit, call, or send a message.",
  description: "Send feedback, ask about bookings, or contact the EMRAKEL team directly.",
  image: "/uploads/house/interior-08.jpg"
};

export const footerSettings = {
  note: "Designed & Developed by Eyoben Technologies PLC",
  copyright: "Copyright 2026 EMRAKEL. All rights reserved."
};

export const jazzSettings = {
  enabled: true,
  eyebrow: "Jazz night",
  title: "Live evening sessions at EMRAKEL",
  description: "Warm lights, house drinks, and a relaxed evening atmosphere for guests.",
  date: "Every Friday",
  time: "7:30 PM - 10:30 PM",
  image: "/uploads/house/interior-06.jpg"
};
