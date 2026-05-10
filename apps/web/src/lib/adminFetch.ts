export async function fetchAdmin<T>(path: string): Promise<T> {
  const base = process.env.API_INTERNAL_URL ?? "http://localhost:4000/api";
  const res = await fetch(`${base}${path}`, {
    headers: { "x-admin-key": process.env.ADMIN_SECRET ?? "" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Admin API ${res.status}: ${path}`);
  return res.json();
}
