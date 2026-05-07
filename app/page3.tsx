'use client';

import { useState } from 'react';
import WeeklyGrid from "@/components/WeeklyGrid";
import ColorPanel from "@/components/ColorPanel";
import { AgendaProvider } from "@/context/AgendaContext";

export default function Page() {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <AgendaProvider>
      <div className="min-h-screen flex justify-center bg-white">

        <div className="flex items-start gap-8 w-full max-w-6xl px-4 pt-0">

          <aside>
            <ColorPanel />
          </aside>

          <main className="flex-1">

            <WeeklyGrid
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
            />

          </main>

        </div>

      </div>
    </AgendaProvider>
  );
}