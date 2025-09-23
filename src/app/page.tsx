// src/app/page.tsx
import InteractionPanel from "@/components/InteractionPanel";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 border-b border-neutral-900 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-pink-500" />
            <span className="text-sm font-semibold tracking-wide">T-Fiber Sales Trainer</span>
          </div>
          <div className="text-xs text-neutral-400">Coach mode • Chat + Voice</div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h1 className="mb-3 text-2xl font-semibold">
            Close more doors with a coach that knows your pitch.
          </h1>
          <p className="mb-6 max-w-prose text-neutral-300">
            Practice objection handling and get role-play coaching grounded in your T-Fiber
            pitch and tactical cards. Use chat for quick prompts or switch to voice for live practice.
          </p>
          <ul className="space-y-2 text-sm text-neutral-300">
            <li>• Built-in playbook: Door pitch + 9 tactical cards</li>
            <li>• Coaching output: talk track, psychology, objections, close ask</li>
            <li>• Voice mode: natural back-and-forth</li>
            <li>• Dark, distraction-free UI for field use</li>
          </ul>
          <div className="mt-8 flex items-center gap-3 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Ready
            </span>
            <span>Try: “How do I beat Spectrum Ultra?” or “Run the door pitch.”</span>
          </div>
        </div>

        <div className="lg:col-span-7">
          <InteractionPanel />
          <p className="mt-3 text-xs text-neutral-500">
            Do not promise a 30-day free trial. Use current official offers only.
          </p>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-6 text-center text-xs text-neutral-600">
        Coaching outputs are guidance only. Confirm pricing/offers in T-Fiber systems.
      </footer>
    </main>
  );
}
