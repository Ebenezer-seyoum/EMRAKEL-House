import { forbidden, getLocalState, getPublicContent, isAdminRequest, saveLocalState } from "@/lib/cms";
import { getSupabaseServer } from "@/lib/supabase";

export async function GET() {
  const content = await getPublicContent();
  return Response.json({ brand: content.brand, home: content.home, source: content.source });
}

export async function PUT(request) {
  if (!isAdminRequest(request)) {
    return forbidden();
  }

  const body = await request.json();
  const supabase = getSupabaseServer();

  if (!supabase) {
    const state = await getLocalState();
    const next = await saveLocalState({
      ...state,
      brand: { ...state.brand, ...(body.brand || {}) },
      home: { ...state.home, ...(body.home || {}) }
    });
    return Response.json({ message: "Settings saved locally.", brand: next.brand, home: next.home, source: "local" });
  }

  const rows = [
    { setting_key: "brand", setting_value: body.brand || {} },
    { setting_key: "home", setting_value: body.home || {} }
  ];

  const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "setting_key" });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ message: "Settings saved.", brand: body.brand, home: body.home, source: "supabase" });
}
