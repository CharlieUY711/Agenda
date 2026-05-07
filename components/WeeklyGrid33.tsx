'use client';

import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

import SlotButton from './SlotButton';
import ColorPanel from './ColorPanel';

import { getWeeklySlots, toggleSlot } from '@/lib/database';
import { useFingerprint } from '@/hooks/useFingerprint';
import { useOwner } from '@/hooks/useOwner';

import { Slot, PastelColor, Label } from '@/types';
import { Range } from '@/lib/availability';

const CORE_HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export default function WeeklyGrid({
  currentDate,
  setCurrentDate
}: {
  currentDate: Date;
  setCurrentDate: (d: Date) => void;
}) {

  /* =========================
     STATE (UNCHANGED)
  ========================= */
  const [slots, setSlots] = useState<Slot[]>([]);
  const [blocked, setBlocked] = useState<Record<string, Range[]>>({});

  const [selectedColor, setSelectedColor] = useState<PastelColor | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);

  const [earlyExpansion, setEarlyExpansion] =
    useState<'collapsed' | 'semi' | 'full'>('collapsed');

  const [lateExpansion, setLateExpansion] =
    useState<'collapsed' | 'semi' | 'full'>('collapsed');

  const { fingerprint } = useFingerprint();
  const { isOwner, isLoading: ownerLoading } = useOwner();

  /* =========================
     WEEK LOGIC (UNCHANGED)
  ========================= */
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(weekStart, i)
  );

  /* =========================
     LOAD (UNCHANGED)
  ========================= */
  useEffect(() => {
    async function loadSlots() {
      const data = await getWeeklySlots(currentDate);
      setSlots(data || []);
    }
    loadSlots();
  }, [currentDate]);

  /* =========================
     SLOT CLICK (UNCHANGED)
  ========================= */
  const handleSlotClick = async (day: string, hour: string) => {
    if (!isOwner) return;
    if (!selectedColor || !selectedLabel) return;
    if (!fingerprint) return;

    const newSlot = await toggleSlot(
      day,
      hour,
      fingerprint,
      selectedColor,
      selectedLabel
    );

    if (newSlot) {
      setSlots(prev =>
        prev.filter(s => !(s.day === day && s.hour === hour))
          .concat(newSlot)
      );
    }
  };

  const getSlotData = (day: string, hour: string) =>
    slots.find(s => s.day === day && s.hour === hour);

  /* =========================
     ROW RENDER (UNCHANGED)
  ========================= */
  const renderHourRow = (hour: string, isGroup = false, groupLabel?: string) => (
    <motion.div
      key={hour}
      className="flex items-center mb-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-14 text-xs text-gray-600 font-semibold mr-3 text-right">
        {hour}
      </div>

      <div className="flex gap-1 flex-1">
        {weekDays.map(day => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const slotData = getSlotData(dayStr, hour);

          return (
            <div key={`${dayStr}-${hour}`} className="w-32">
              <SlotButton
                day={dayStr}
                hour={hour}
                color={slotData?.color as PastelColor}
                label={slotData?.label}
                isOwner={isOwner}
                onClick={() => handleSlotClick(dayStr, hour)}
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  /* =========================
     LOADING
  ========================= */
  if (ownerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 rounded-full animate-spin" />
      </div>
    );
  }

  /* =========================
     UI (ONLY CHANGE: arrows in days row)
  ========================= */
  return (
    <div className="min-h-screen bg-white flex justify-center p-3">

      {isOwner && (
        <ColorPanel
          selectedColor={selectedColor}
          selectedLabel={selectedLabel}
          onColorSelect={setSelectedColor}
          onLabelSelect={setSelectedLabel}
        />
      )}

      <div className="flex-1">

        {/* =========================
           DAYS ROW + NAV ARROWS
        ========================= */}
        <div className="flex items-center mb-2">

          {/* LEFT ARROW */}
          <button
            onClick={() =>
              setCurrentDate(d => {
                const n = new Date(d);
                n.setDate(n.getDate() - 7);
                return n;
              })
            }
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
          >
            ←
          </button>

          <div className="w-14 mr-3" />

          <div className="flex gap-1 flex-1">
            {weekDays.map(day => (
              <div key={day.toString()} className="w-32 text-center text-xs font-bold">
                {format(day, 'EEEE d', { locale: es })}
              </div>
            ))}
          </div>

          {/* RIGHT ARROW */}
          <button
            onClick={() =>
              setCurrentDate(d => {
                const n = new Date(d);
                n.setDate(n.getDate() + 7);
                return n;
              })
            }
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
          >
            →
          </button>

        </div>

        {/* GRID CONTENT (UNCHANGED) */}
        <div className="h-px bg-gray-200 mb-2" />

        {CORE_HOURS.map(hour => renderHourRow(hour))}

      </div>
    </div>
  );
}