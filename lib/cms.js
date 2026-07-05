import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  aboutSettings,
  brand,
  brandImage,
  contactSettings,
  footerSettings,
  galleryImages,
  homeSettings,
  houseImages,
  jazzSettings,
  menuCategories,
  menuItems
} from "@/lib/data";
import { getSupabaseServer } from "@/lib/supabase";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "admin-data.json");

export const defaultState = {
  brand,
  home: {
    ...homeSettings,
    heroImage: houseImages[7],
    featureImage: houseImages[4],
    galleryImage: houseImages[10]
  },
  about: aboutSettings,
  contact: contactSettings,
  footer: footerSettings,
  jazz: jazzSettings,
  categories: menuCategories,
  items: menuItems,
  gallery: galleryImages.map((image, index) => ({
    id: `gallery-${index + 1}`,
    title: `Gallery ${index + 1}`,
    image
  })),
  bookings: [],
  orders: [],
  customers: [],
  feedback: []
};

function withIds(state) {
  const defaultCategoryById = Object.fromEntries(defaultState.categories.map((category) => [category.id, category]));
  const categories = state?.categories?.length
    ? state.categories.map((category) => ({
        ...(defaultCategoryById[category.id] || {}),
        ...category,
        image: category.image || defaultCategoryById[category.id]?.image || ""
      }))
    : defaultState.categories;

  return {
    ...defaultState,
    ...state,
    brand: { ...defaultState.brand, ...(state?.brand || {}) },
    home: { ...defaultState.home, ...(state?.home || {}) },
    about: { ...defaultState.about, ...(state?.about || {}) },
    contact: { ...defaultState.contact, ...(state?.contact || {}) },
    footer: { ...defaultState.footer, ...(state?.footer || {}) },
    jazz: { ...defaultState.jazz, ...(state?.jazz || {}) },
    categories,
    items: state?.items?.length ? state.items : defaultState.items,
    gallery: state?.gallery?.length ? state.gallery : defaultState.gallery,
    bookings: state?.bookings || [],
    orders: state?.orders || [],
    customers: state?.customers || [],
    feedback: state?.feedback || []
  };
}

export async function getLocalState() {
  try {
    const file = await readFile(dataFile, "utf8");
    return withIds(JSON.parse(file));
  } catch {
    await saveLocalState(defaultState);
    return defaultState;
  }
}

export async function saveLocalState(nextState) {
  await mkdir(dataDir, { recursive: true });
  const state = withIds(nextState);
  await writeFile(dataFile, JSON.stringify(state, null, 2));
  return state;
}

export async function updateLocalState(updater) {
  const current = await getLocalState();
  return saveLocalState(await updater(current));
}

export function isAdminRequest(request) {
  return request.headers.get("x-emrakel-role") === "admin";
}

export function forbidden() {
  return Response.json({ error: "Admin access is required." }, { status: 403 });
}

export function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export async function getPublicContent() {
  const supabase = getSupabaseServer();

  if (!supabase) {
    const state = await getLocalState();
    return { ...state, source: "local" };
  }

  try {
    const [{ data: settings }, { data: categories }, { data: items }, { data: gallery }] = await Promise.all([
      supabase.from("site_settings").select("*"),
      supabase.from("menu_categories").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("menu_items").select("*").eq("is_available", true).order("sort_order"),
      supabase.from("gallery_images").select("*").eq("is_active", true).order("sort_order")
    ]);

    const settingsMap = Object.fromEntries((settings || []).map((row) => [row.setting_key, row.setting_value]));
    const categoryMap = Object.fromEntries((categories || []).map((category) => [category.id, category.slug]));

    return {
      brand: { ...defaultState.brand, ...(settingsMap.brand || {}) },
      home: { ...defaultState.home, ...(settingsMap.home || {}) },
      about: { ...defaultState.about, ...(settingsMap.about || {}) },
      contact: { ...defaultState.contact, ...(settingsMap.contact || {}) },
      footer: { ...defaultState.footer, ...(settingsMap.footer || {}) },
      jazz: { ...defaultState.jazz, ...(settingsMap.jazz || {}) },
      categories: (categories || defaultState.categories).map((category) => ({
        id: category.slug || category.id,
        name: category.name,
        parentId: category.parent_slug || category.parentId || "",
        description: category.description || "",
        image: category.image_url || category.image || ""
      })),
      items: (items || []).map((item) => ({
        id: item.id,
        category: categoryMap[item.category_id] || item.category || "burgers",
        name: item.name,
        description: item.description,
        price: Number(item.price),
        image: item.image_url || brandImage
      })),
      gallery: (gallery || []).map((image) => ({
        id: image.id,
        title: image.title || "Gallery image",
        image: image.image_url || brandImage
      })),
      source: "supabase"
    };
  } catch {
    const state = await getLocalState();
    return { ...state, source: "local" };
  }
}
