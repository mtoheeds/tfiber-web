// src/app/sales/page.tsx
import { pitch, playbook } from "@/lib/salesContent";

export default function SalesPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">T-Fiber Sales Pitch & Tactical Cards</h1>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Door Pitch</h2>
        <pre className="whitespace-pre-wrap rounded border p-4 text-sm bg-white">
          {pitch}
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tactical Cards</h2>
        <div className="space-y-4">
          {playbook.map((card, idx) => (
            <div key={idx} className="rounded border p-4 bg-white">
              <h3 className="font-semibold">{card.title}</h3>
              <pre className="whitespace-pre-wrap text-sm mt-2">{card.body}</pre>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
