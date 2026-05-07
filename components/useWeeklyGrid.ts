'use client';

import { format, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

type Props = {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
};

const CORE_HOURS = [
  '08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00','18:00',
];

export default function WeeklyGrid({
  currentDate,
  setCurrentDate,
}: Props) {

  // 🔒 Protección contra fechas inválidas
  const safeDate =
    currentDate instanceof Date && !isNaN(currentDate.getTime())
      ? currentDate
      : new Date();

  const weekStart = startOfWeek(safeDate, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(weekStart, i)
  );

  // ---------------- NAVIGATION (FIXED) ----------------
  const goPrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const goNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  // ---------------- ROW RENDER ----------------
  const renderRow = (hour: string) => {
    return (
      <div key={hour} className="flex items-center mb-1">

        {/* HOUR */}
        <div className="w-14 text-right pr-2 text-xs text-gray-600">
          {hour}
        </div>

        {/* CELLS */}
        <div className="flex gap-1 flex-1">
          {weekDays.map(day => {
            const key = `${format(day, 'yyyy-MM-dd')}-${hour}`;

            return (
              <div
                key={key}
                className="w-32 h-8 rounded-lg border border-gray-200 bg-white"
              />
            );
          })}
        </div>

        {/* RIGHT SPACER */}
        <div className="w-14" />
      </div>
    );
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-white flex justify-center p-3">

      <div className="w-full max-w-6xl">

        {/* NAV */}
        <div className="flex items-center mb-3">

          <button onClick={goPrevWeek} className="px-2">
            ←
          </button>

          <div className="flex-1 text-center font-bold">
            Semana {format(weekStart, 'dd/MM')}
          </div>

          <button onClick={goNextWeek} className="px-2">
            →
          </button>

        </div>

        {/* DAYS HEADER */}
        <div className="flex mb-2">

          <div className="w-14" />

          <div className="flex flex-1 gap-1">
            {weekDays.map(day => (
              <div
                key={day.toString()}
                className="w-32 text-center text-xs font-bold"
              >
                {format(day, 'EEEE d', { locale: es })}
              </div>
            ))}
          </div>

          <div className="w-14" />
        </div>

        <div className="h-px bg-gray-200 mb-2" />

        {/* GRID */}
        {CORE_HOURS.map(renderRow)}

      </div>
    </div>
  );
}