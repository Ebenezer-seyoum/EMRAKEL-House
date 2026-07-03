import { forbidden, getLocalState, getPublicContent, isAdminRequest, saveLocalState } from "@/lib/cms";
import { getSupabaseServer } from "@/lib/supabase";

export async function GET() {
  const content = await getPublicContent();
  return Response.json({ gallery: content.gallery, source: content.source });
}

export async function PUT(request) {
  if (!isAdminRequest(request)) {
    return forbidden();
  }

  const body = await request.json();
  const gallery = Array.isArray(body.gallery) ? body.gallery : [];
  const supabase = getSupabaseServer();

  if (!supabase) {
    const state = await getLocalState();
    const next = await saveLocalState({ ...state, gallery });
    return Response.json({ message: "Gallery saved locally.", gallery: next.gallery, source: "local" });
  }

  await supabase.from("gallery_images").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const rows = gallery.map((item, index) => ({
    title: item.title || `Gallery ${index + 1}`,
    image_url: item.image,
    sort_order: index + 1,
    is_active: true
  }));
  const { error } = rows.length ? await supabase.from("gallery_images").insert(rows) : { error: null };

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ message: "Gallery saved.", gallery, source: "supabase" });
}
