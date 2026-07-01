import { menuCategories, menuItems } from "@/lib/data";
import { getSupabaseServer } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseServer();

  if (!supabase) {
    return Response.json({ categories: menuCategories, items: menuItems, source: "local" });
  }

  const [{ data: categories, error: categoryError }, { data: items, error: itemError }] = await Promise.all([
    supabase.from("menu_categories").select("*").order("sort_order"),
    supabase.from("menu_items").select("*").eq("is_available", true).order("sort_order")
  ]);

  if (categoryError || itemError) {
    return Response.json({ error: categoryError?.message || itemError?.message }, { status: 500 });
  }

  return Response.json({ categories, items, source: "supabase" });
}
