'use client';

import { useState } from "react";

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = String(i).padStart(2, "0");
  return `${hour}:00`;
});

type Range = {
  start: string;
  end: string;
};

export default function AvailabilityEditor() {
  const [ranges, setRanges] = useState<Record<string, Range[]>>({});

  const addOneHour = (h: string) => {
    const n = parseInt(h);
    return `${String(n + 1).padStart(2, "0")}:00`;
  };

  const toggleHour = (day: string, hour: string) => {
    setRanges(prev => {
      const dayRanges = prev[day] || [];

      const exists = dayRanges.find(
        r => hour >= r.start && hour < r.end
      );

      if (exists) {
        return {
          ...prev,
          [day]: dayRanges.filter(r => r !== exists),
        };
      }

      return {
        ...prev,
        [day]: [
          ...dayRanges,
          { start: hour, end: addOneHour(hour) }
        ],
      };
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Editor de disponibilidad
      </h2>

      <div className="grid grid-cols-2 gap-2">
        {HOURS.map(hour => (
          <button
            key={hour}
            onClick={() => toggleHour("today", hour)}
            className="p-2 border rounded hover:bg-gray-100"
          >
            {hour}
          </button>
        ))}
      </div>
    </div>
  );
}
