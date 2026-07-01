import { badRequest, isEmail, ok } from "@/lib/api";
import { getSupabaseServer } from "@/lib/supabase";

export async function POST(request) {
  const body = await request.json();

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
    total_amount: Number(body.total_amount || 0)
  };

  const supabase = getSupabaseServer();

  if (!supabase) {
    return ok({ message: "Order received locally. Add Supabase keys to store it in the database.", order }, 201);
  }

  const { data: savedOrder, error: orderError } = await supabase.from("orders").insert(order).select().single();

  if (orderError) {
    return Response.json({ error: orderError.message }, { status: 500 });
  }

  const orderItems = body.items.map((item) => ({
    order_id: savedOrder.id,
    menu_item_id: item.menu_item_id,
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
