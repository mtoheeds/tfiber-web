// src/app/sales/page.tsx
import { pitch, playbook } from "@/lib/salesContent";

export default function SalesPage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">T-Fiber Sales Guidance</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Full Pitch</h2>
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{pitch}</pre>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Tactical Cards</h2>
        <ul className="space-y-4">
          {Object.entries(playbook).map(([key, value]) => (
            <li key={key} className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">{key.toUpperCase()}</h3>
              <pre className="whitespace-pre-wrap">{value}</pre>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
