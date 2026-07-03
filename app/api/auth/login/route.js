import { badRequest, ok } from "@/lib/api";
import { verifyPassword } from "@/lib/password";
import { getSupabaseServer } from "@/lib/supabase";

const users = [
  {
    role: "admin",
    email: process.env.ADMIN_EMAIL || "admin@emrakel.com",
    password: process.env.ADMIN_PASSWORD || "kena@12345",
    name: "EMRAKEL Admin"
  },
  {
    role: "customer",
    email: process.env.CUSTOMER_EMAIL || "customer@emrakel.house",
    password: process.env.CUSTOMER_PASSWORD || "customer123",
    name: "Customer"
  }
];

export async function POST(request) {
  const body = await request.json();

  if (!body.email || !body.password) {
    return badRequest("Email and password are required.");
  }

  const supabase = getSupabaseServer();
  const email = String(body.email).toLowerCase();

  if (supabase) {
    const { data: user, error } = await supabase
      .from("app_users")
      .select("id,email,password_hash,name,phone,role")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!user || !verifyPassword(body.password, user.password_hash)) {
      return Response.json({ error: "Invalid login details." }, { status: 401 });
    }

    return ok({
      message: "Login successful.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  }

  const user = users.find(
    (item) => item.email.toLowerCase() === email && item.password === body.password
  );

  if (!user) {
    return Response.json({ error: "Invalid login details." }, { status: 401 });
  }

  return ok({
    message: "Login successful.",
    user: {
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
}
