import { ok } from "@/lib/api";
import { forbidden, getLocalState, isAdminRequest } from "@/lib/cms";
import { getSupabaseServer } from "@/lib/supabase";

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return forbidden();
  }

  const supabase = getSupabaseServer();

  if (!supabase) {
    const state = await getLocalState();
    return ok({ customers: state.customers, source: "local" });
  }

  const { data, error } = await supabase
    .from("app_users")
    .select("id,email,name,phone,role,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return ok({ customers: data, source: "supabase" });
}
