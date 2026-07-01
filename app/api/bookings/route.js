import { badRequest, isEmail, ok } from "@/lib/api";
import { getSupabaseServer } from "@/lib/supabase";

export async function POST(request) {
  const body = await request.json();
  const guests = Number(body.guests);

  if (!body.customer_name || !body.phone || !body.booking_date || !body.booking_time || !guests) {
    return badRequest("Name, phone, date, time, and guests are required.");
  }

  if (body.email && !isEmail(body.email)) {
    return badRequest("Please enter a valid email address.");
  }

  const booking = {
    customer_name: body.customer_name,
    phone: body.phone,
    email: body.email || null,
    booking_date: body.booking_date,
    booking_time: body.booking_time,
    guests,
    notes: body.notes || null,
    status: "pending"
  };

  const supabase = getSupabaseServer();

  if (!supabase) {
    return ok({ message: "Booking received locally. Add Supabase keys to store it in the database.", booking }, 201);
  }

  const { data, error } = await supabase.from("table_bookings").insert(booking).select().single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return ok({ message: "Booking request sent. We will confirm soon.", booking: data }, 201);
}
