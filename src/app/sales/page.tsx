// src/app/sales/page.tsx
"use client";
import { useSales } from "@/hooks/useSales";

export default function SalesPage() {
  const { data, loading, err } = useSales();

  if (loading) return <main className="p-6">Loading…</main>;
  if (err || !data) return <main className="p-6">Error: {err}</main>;

  return (
    <main className="prose max-w-3xl p-6">
      <h1>Door Pitch</h1>
      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
        {data.pitch}
      </pre>

      <h2>Playbook Cards</h2>
      <ol>
        {data.playbook.map((c) => (
          <li key={c.title}>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
