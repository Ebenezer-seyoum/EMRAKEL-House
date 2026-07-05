import { forbidden, getLocalState, getPublicContent, inferMenuSide, isAdminRequest, saveLocalState } from "@/lib/cms";
import { getSupabaseServer } from "@/lib/supabase";

export async function GET() {
  const content = await getPublicContent();
  return Response.json({ categories: content.categories, items: content.items, source: content.source });
}

export async function PUT(request) {
  if (!isAdminRequest(request)) {
    return forbidden();
  }

  const body = await request.json();
  const categories = Array.isArray(body.categories) ? body.categories : [];
  const items = Array.isArray(body.items) ? body.items : [];
  const supabase = getSupabaseServer();

  async function saveLocalMenu(message = "Menu saved locally.") {
    const state = await getLocalState();
    const next = await saveLocalState({ ...state, categories, items });
    return Response.json({
      message,
      categories: next.categories,
      items: next.items,
      source: "local"
    });
  }

  if (!supabase) {
    return saveLocalMenu();
  }

  const categoryRows = categories.map((category, index) => ({
    slug: category.id,
    name: category.name,
    description: category.description || "",
    parent_slug: category.parentId || null,
    image_url: category.image || null,
    menu_side: category.menuSide || inferMenuSide(category),
    sort_order: index + 1,
    is_active: true
  }));

  try {
    await supabase.from("menu_categories").update({ is_active: false }).neq("slug", "__never__");
    const { data: savedCategories, error: categoryError } = await supabase
      .from("menu_categories")
      .upsert(categoryRows, { onConflict: "slug" })
      .select("*");

    if (categoryError) {
      return Response.json({ error: categoryError.message }, { status: 500 });
    }

    const categoryIdBySlug = Object.fromEntries((savedCategories || []).map((category) => [category.slug, category.id]));
    const itemRows = items.map((item, index) => ({
      slug: item.id,
      category_id: categoryIdBySlug[item.category] || null,
      name: item.name,
      description: item.description,
      price: Number(item.price || 0),
      image_url: null,
      sort_order: index + 1,
      is_available: true
    }));

    await supabase.from("menu_items").update({ is_available: false }).neq("slug", "__never__");
    const { error: itemError } = await supabase.from("menu_items").upsert(itemRows, { onConflict: "slug" });

    if (itemError) {
      return Response.json({ error: itemError.message }, { status: 500 });
    }

    return Response.json({ message: "Menu saved.", categories, items, source: "supabase" });
  } catch {
    return saveLocalMenu("Menu saved locally because Supabase is unavailable.");
  }
}
