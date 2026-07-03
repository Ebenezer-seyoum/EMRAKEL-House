import { forbidden, getLocalState, getPublicContent, isAdminRequest, saveLocalState } from "@/lib/cms";
import { getSupabaseServer } from "@/lib/supabase";

export async function GET() {
  const content = await getPublicContent();
  return Response.json({
    brand: content.brand,
    home: content.home,
    about: content.about,
    contact: content.contact,
    footer: content.footer,
    jazz: content.jazz,
    source: content.source
  });
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
      home: { ...state.home, ...(body.home || {}) },
      about: { ...state.about, ...(body.about || {}) },
      contact: { ...state.contact, ...(body.contact || {}) },
      footer: { ...state.footer, ...(body.footer || {}) },
      jazz: { ...state.jazz, ...(body.jazz || {}) }
    });
    return Response.json({ message: "Settings saved locally.", ...next, source: "local" });
  }

  const rows = [
    { setting_key: "brand", setting_value: body.brand || {} },
    { setting_key: "home", setting_value: body.home || {} },
    { setting_key: "about", setting_value: body.about || {} },
    { setting_key: "contact", setting_value: body.contact || {} },
    { setting_key: "footer", setting_value: body.footer || {} },
    { setting_key: "jazz", setting_value: body.jazz || {} }
  ];

  const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "setting_key" });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ message: "Settings saved.", ...body, source: "supabase" });
}
