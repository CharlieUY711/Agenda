'use client';

import WeeklyGrid from "@/components/WeeklyGrid";
import ColorPanel from "@/components/ColorPanel";
import { AgendaProvider } from "@/context/AgendaContext";

export default function Page() {
  return (
    <AgendaProvider>
      <div className="min-h-screen flex justify-center bg-white">

        {/* CONTAINER */}
        <div className="flex items-start gap-8 w-full max-w-6xl px-4 pt-6">

          {/* LEFT PANEL */}
          <aside className="flex flex-col">
            <ColorPanel />
          </aside>

          {/* MAIN AGENDA */}
          <main className="flex-1">
            <WeeklyGrid />
          </main>

        </div>

      </div>
    </AgendaProvider>
  );
}
