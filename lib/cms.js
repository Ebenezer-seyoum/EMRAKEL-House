import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { brand, brandImage, galleryImages, homeSettings, menuCategories, menuItems } from "@/lib/data";
import { getSupabaseServer } from "@/lib/supabase";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "admin-data.json");

export const defaultState = {
  brand,
  home: {
    ...homeSettings,
    heroImage: brandImage
  },
  categories: menuCategories,
  items: menuItems,
  gallery: galleryImages.map((image, index) => ({
    id: `gallery-${index + 1}`,
    title: `Gallery ${index + 1}`,
    image
  })),
  bookings: [],
  orders: []
};

function withIds(state) {
  return {
    ...defaultState,
    ...state,
    brand: { ...defaultState.brand, ...(state?.brand || {}) },
    home: { ...defaultState.home, ...(state?.home || {}) },
    categories: state?.categories?.length ? state.categories : defaultState.categories,
    items: state?.items?.length ? state.items : defaultState.items,
    gallery: state?.gallery?.length ? state.gallery : defaultState.gallery,
    bookings: state?.bookings || [],
    orders: state?.orders || []
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
    categories: (categories || defaultState.categories).map((category) => ({
      id: category.slug || category.id,
      name: category.name
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
}
