// src/app/sales/page.tsx
import { pitch, playbook } from "@/lib/salesContent";

export default function SalesPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">T-Fiber Pitch & Cards</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">Door Pitch</h2>
        <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded border mt-2">
          {pitch}
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Tactical Playbook</h2>
        <ul className="space-y-4">
          {playbook.map((c, i) => (
            <li key={i} className="border rounded p-4">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="whitespace-pre-wrap mt-2">{c.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
