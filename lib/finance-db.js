import { Pool } from "pg";

let pool;
export function getFinancePool() {
  if (!process.env.DATABASE_URL) return null;
  pool ||= new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  return pool;
}
export async function readFinanceFromPostgres({ from, to } = {}) {
  const db = getFinancePool();
  if (!db) return null;
  const params = [];
  const dateFilter = (column) => {
    const clauses = [];
    if (from) { params.push(from); clauses.push(column + " >= $" + params.length); }
    if (to) { params.push(to); clauses.push(column + " <= $" + params.length); }
    return clauses.length ? " and " + clauses.join(" and ") : "";
  };
  const income = await db.query("select id, order_id, category, description, amount, payment_method, transaction_date, created_at from public.income_transactions where 1=1" + dateFilter("transaction_date") + " order by transaction_date desc, created_at desc", params);
  const expenses = await db.query("select id, category, description, amount, payment_method, expense_date, status, created_at from public.expenses where status = 'active'" + dateFilter("expense_date") + " order by expense_date desc, created_at desc", params);
  const incomeTotal = income.rows.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const expenseTotal = expenses.rows.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return { income: income.rows, expenses: expenses.rows, totals: { income: incomeTotal, expenses: expenseTotal, profit: incomeTotal - expenseTotal } };
}
export async function createPostgresExpense(body) {
  const db = getFinancePool();
  if (!db) return null;
  const result = await db.query("insert into public.expenses (category, description, amount, payment_method, expense_date) values ($1, $2, $3, $4, coalesce($5::date, current_date)) returning *", [body.category, body.description, Number(body.amount), body.payment_method || "cash", body.expense_date || null]);
  return result.rows[0];
}
