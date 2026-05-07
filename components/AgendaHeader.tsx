'use client';

import { addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AgendaHeader({ currentDate, setCurrentDate }) {

  const goPrevWeek = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const goNextWeek = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  return (
    <div className="flex items-center justify-between mb-3">

      <button
        onClick={goPrevWeek}
        className="px-3 py-1 bg-gray-200 rounded"
      >
        ←
      </button>

      <div className="text-center">
        <h1 className="text-2xl font-bold">Mi Agenda Semanal</h1>
        <p className="text-xs text-gray-500">
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </p>
      </div>

      <button
        onClick={goNextWeek}
        className="px-3 py-1 bg-gray-200 rounded"
      >
        →
      </button>

    </div>
  );
}
