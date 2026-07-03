export const brand = {
  name: "EMRAKEL",
  subtitle: "Burger House",
  phone: "+251 900 000 000",
  email: "hello@emrakel.house",
  address: "Addis Ababa, Ethiopia",
  hours: "Mon - Sun, 10:00 AM - 11:30 PM"
};

export const homeSettings = {
  eyebrow: "Black and white burger house",
  headline: "EMRAKEL Burger House",
  description:
    "A modern burger house with a sharp black-and-white identity, premium comfort food, and a clean visual system ready for future admin-managed menu photos.",
  primaryAction: "Book a Table",
  secondaryAction: "View Menu"
};

export const brandImage = "/logo.jpg";

export const menuCategories = [
  { id: "burgers", name: "Burgers" },
  { id: "pizza", name: "Pizza" },
  { id: "cocktails", name: "Cocktails" }
];

export const menuItems = [
  {
    id: "classic-burger",
    category: "burgers",
    name: "Classic House Burger",
    description: "Grilled beef, cheddar, house sauce, pickles, sesame bun.",
    price: 420,
    image: brandImage
  },
  {
    id: "smoky-double",
    category: "burgers",
    name: "Smoky Double Burger",
    description: "Double patty, caramelized onion, smoked sauce, crisp lettuce.",
    price: 560,
    image: brandImage
  },
  {
    id: "golden-margherita",
    category: "pizza",
    name: "House Margherita",
    description: "Mozzarella, tomato, basil, olive oil, crisp house crust.",
    price: 520,
    image: brandImage
  },
  {
    id: "pepperoni-fire",
    category: "pizza",
    name: "Pepperoni House Pizza",
    description: "Pepperoni, mozzarella, oregano, and a rich tomato base.",
    price: 610,
    image: brandImage
  },
  {
    id: "citrus-gold",
    category: "cocktails",
    name: "Citrus House",
    description: "Orange, lemon, house syrup, and a clean bright finish.",
    price: 330,
    image: brandImage
  },
  {
    id: "ember-martini",
    category: "cocktails",
    name: "Black Label Martini",
    description: "Smooth, chilled, citrus edge, and a sharp lounge presentation.",
    price: 390,
    image: brandImage
  }
];

export const galleryImages = [
  brandImage,
  brandImage,
  brandImage,
  brandImage
];
