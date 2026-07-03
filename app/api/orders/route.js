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
    return ok({ orders: state.orders, source: "local" });
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return ok({ orders: data, source: "supabase" });
}

export async function POST(request) {
  const body = await request.json();
  const totalAmount = Number(body.total_amount || 0);

  if (!body.customer_name || !body.phone || !Array.isArray(body.items) || body.items.length === 0) {
    return badRequest("Customer name, phone, and at least one order item are required.");
  }

  if (body.email && !isEmail(body.email)) {
    return badRequest("Please enter a valid email address.");
  }

  const order = {
    customer_name: body.customer_name,
    phone: body.phone,
    email: body.email || null,
    order_type: body.order_type || "pickup",
    address: body.address || null,
    notes: body.notes || null,
    status: "pending",
    total_amount: Number.isFinite(totalAmount) ? totalAmount : 0
  };

  const supabase = getSupabaseServer();

  if (!supabase) {
    const state = await getLocalState();
    const savedOrder = {
      id: newId("order"),
      ...order,
      items: body.items,
      created_at: new Date().toISOString()
    };
    await saveLocalState({ ...state, orders: [savedOrder, ...state.orders] });
    return ok({ message: "Order sent successfully.", order: savedOrder }, 201);
  }

  const { data: savedOrder, error: orderError } = await supabase.from("orders").insert(order).select().single();

  if (orderError) {
    return Response.json({ error: orderError.message }, { status: 500 });
  }

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const orderItems = body.items.map((item) => ({
    order_id: savedOrder.id,
    menu_item_id: uuidPattern.test(item.menu_item_id || "") ? item.menu_item_id : null,
    name: item.name,
    quantity: Number(item.quantity || 1),
    unit_price: Number(item.unit_price || 0)
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    return Response.json({ error: itemsError.message }, { status: 500 });
  }

  return ok({ message: "Order sent successfully.", order: savedOrder }, 201);
}

export async function PATCH(request) {
  if (!isAdminRequest(request)) {
    return forbidden();
  }

  const body = await request.json();

  if (!body.id || !body.status) {
    return badRequest("Order id and status are required.");
  }

  const supabase = getSupabaseServer();

  if (!supabase) {
    const state = await getLocalState();
    const orders = state.orders.map((order) =>
      order.id === body.id ? { ...order, status: body.status, updated_at: new Date().toISOString() } : order
    );
    await saveLocalState({ ...state, orders });
    return ok({ message: "Order updated locally.", orders, source: "local" });
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return ok({ message: "Order updated.", order: data, source: "supabase" });
}
