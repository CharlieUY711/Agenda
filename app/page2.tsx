'use client';

import { useState } from 'react';
import WeeklyGrid from "@/components/WeeklyGrid";
import ColorPanel from "@/components/ColorPanel";
import AgendaHeader from "@/components/AgendaHeader";
import { AgendaProvider } from "@/context/AgendaContext";

export default function Page() {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <AgendaProvider>
      <div className="min-h-screen flex justify-center bg-white">

        <div className="flex flex-col w-full max-w-6xl px-4 pt-0">

          {/* HEADER (navegación) */}
          <AgendaHeader
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />

          <div className="flex items-start gap-8">

            {/* PANEL COLORES */}
            <aside>
              <ColorPanel />
            </aside>

            {/* GRID */}
            <main className="flex-1">
              <WeeklyGrid
                currentDate={currentDate}
              />
            </main>

          </div>

        </div>

      </div>
    </AgendaProvider>
  );
}