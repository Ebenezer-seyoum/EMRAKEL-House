import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getLocalState, newId, saveLocalState } from "@/lib/cms";
import { createPostgresExpense, readFinanceFromPostgres } from "@/lib/finance-db";

export const runtime = "nodejs";
const app = new Hono().basePath("/api/hono");

app.get("/health", (c) => c.json({ ok: true, service: "emrakel-api" }));

app.get("/finance", async (c) => {
  const from = c.req.query("from");
  const to = c.req.query("to");
  const postgresFinance = await readFinanceFromPostgres({ from, to });
  if (postgresFinance) return c.json(postgresFinance);
  const state = await getLocalState();
  const inRange = (value) => (!from || value >= from) && (!to || value <= to);
  const income = (state.income || []).filter((item) => inRange(String(item.transaction_date || item.created_at).slice(0, 10)));
  const expenses = (state.expenses || []).filter((item) => item.status !== "voided" && inRange(String(item.expense_date || item.created_at).slice(0, 10)));
  const incomeTotal = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const expenseTotal = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return c.json({ income, expenses, totals: { income: incomeTotal, expenses: expenseTotal, profit: incomeTotal - expenseTotal } });
});

app.post("/expenses", async (c) => {
  const body = await c.req.json();
  const amount = Number(body.amount);
  if (!body.category || !body.description || !Number.isFinite(amount) || amount <= 0) return c.json({ error: "Category, description, and a positive amount are required." }, 400);
  const postgresExpense = await createPostgresExpense(body);
  if (postgresExpense) return c.json({ expense: postgresExpense }, 201);
  const state = await getLocalState();
  const expense = { id: newId("expense"), category: body.category, description: body.description, amount, payment_method: body.payment_method || "cash", expense_date: body.expense_date || new Date().toISOString().slice(0, 10), status: "active", created_at: new Date().toISOString() };
  await saveLocalState({ ...state, expenses: [expense, ...(state.expenses || [])] });
  return c.json({ expense }, 201);
});

app.patch("/expenses/:id/void", async (c) => {
  const state = await getLocalState();
  await saveLocalState({ ...state, expenses: (state.expenses || []).map((item) => item.id === c.req.param("id") ? { ...item, status: "voided" } : item) });
  return c.json({ ok: true });
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
