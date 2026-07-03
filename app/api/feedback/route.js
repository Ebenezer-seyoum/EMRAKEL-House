import { badRequest, isEmail, ok } from "@/lib/api";
import { forbidden, getLocalState, isAdminRequest, newId, saveLocalState } from "@/lib/cms";
import { getSupabaseServer } from "@/lib/supabase";

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return forbidden();
  }

  const supabase = getSupabaseServer();

  if (!supabase) {
    const state = await getLocalState();
    return ok({ feedback: state.feedback, source: "local" });
  }

  const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return ok({ feedback: data, source: "supabase" });
}

export async function POST(request) {
  const body = await request.json();

  if (!body.name || !body.message) {
    return badRequest("Name and message are required.");
  }

  if (body.email && !isEmail(body.email)) {
    return badRequest("Please enter a valid email address.");
  }

  const message = {
    name: body.name,
    phone: body.phone || null,
    email: body.email || null,
    subject: body.subject || "Website feedback",
    message: body.message,
    status: "new"
  };

  const supabase = getSupabaseServer();

  if (!supabase) {
    const state = await getLocalState();
    const saved = { id: newId("feedback"), ...message, created_at: new Date().toISOString() };
    await saveLocalState({ ...state, feedback: [saved, ...state.feedback] });
    return ok({ message: "Message sent successfully.", feedback: saved }, 201);
  }

  const { data, error } = await supabase.from("contact_messages").insert(message).select().single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return ok({ message: "Message sent successfully.", feedback: data }, 201);
}

export async function PATCH(request) {
  if (!isAdminRequest(request)) {
    return forbidden();
  }

  const body = await request.json();

  if (!body.id || !body.status) {
    return badRequest("Feedback id and status are required.");
  }

  const supabase = getSupabaseServer();

  if (!supabase) {
    const state = await getLocalState();
    const feedback = state.feedback.map((item) =>
      item.id === body.id ? { ...item, status: body.status, updated_at: new Date().toISOString() } : item
    );
    await saveLocalState({ ...state, feedback });
    return ok({ message: "Feedback updated locally.", feedback, source: "local" });
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return ok({ message: "Feedback updated.", feedback: data, source: "supabase" });
}
