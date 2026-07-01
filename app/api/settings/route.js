import { brand, homeSettings } from "@/lib/data";
import { getSupabaseServer } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseServer();

  if (!supabase) {
    return Response.json({ brand, home: homeSettings, source: "local" });
  }

  const { data, error } = await supabase.from("site_settings").select("*");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ settings: data, source: "supabase" });
}
