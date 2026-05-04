'use client';

import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import SlotButton from './SlotButton';
import ColorPickerModal from './ColorPickerModal';
import LabelPicker from './LabelPicker';
import { getWeeklySlots, toggleSlot, deleteSlot } from '@/lib/database';
import { useFingerprint } from '@/hooks/useFingerprint';
import { useOwner } from '@/hooks/useOwner';
import { Slot, PastelColor, Label } from '@/types';

const HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export default function WeeklyGrid() {
  const [currentDate] = useState(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; hour: string } | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState<PastelColor | null>(null);

  const { fingerprint } = useFingerprint();
  const { isOwner, isLoading: ownerLoading } = useOwner();

  // Generar días de la semana
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Cargar slots de la semana
  useEffect(() => {
    async function loadSlots() {
      const data = await getWeeklySlots(currentDate);
      setSlots(data);
    }
    loadSlots();
  }, [currentDate]);

  const handleSlotClick = (day: string, hour: string) => {
    if (!isOwner) return;
    setSelectedSlot({ day, hour });
    setShowColorPicker(true);
  };

  const handleColorSelect = (color: PastelColor) => {
    setSelectedColor(color);
    setShowLabelPicker(true);
  };

  const handleLabelSelect = async (label: Label) => {
    if (!selectedSlot || !selectedColor || !fingerprint) return;

    const newSlot = await toggleSlot(
      selectedSlot.day,
      selectedSlot.hour,
      fingerprint,
      selectedColor,
      label
    );

    if (newSlot) {
      setSlots(prev => {
        const filtered = prev.filter(
          s => !(s.day === selectedSlot.day && s.hour === selectedSlot.hour)
        );
        return [...filtered, newSlot];
      });
    }

    // Reset
    setSelectedSlot(null);
    setSelectedColor(null);
  };

  const getSlotData = (day: string, hour: string) => {
    return slots.find(s => s.day === day && s.hour === hour);
  };

  if (ownerLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-pastel-pink border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pastel-pink via-pastel-lavender to-pastel-blue mb-2">
            Mi Agenda Semanal
          </h1>
          <p className="text-gray-600 font-body">
            {isOwner ? '✨ Toca una celda para configurarla' : '👀 Modo solo lectura'}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="bg-gradient-to-br from-pastel-pink/10 via-pastel-lavender/10 to-pastel-blue/10 rounded-3xl p-6 shadow-soft">
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Header días */}
              <div className="grid grid-cols-8 gap-4 mb-4">
                <div className="w-20" /> {/* Espacio para horas */}
                {weekDays.map(day => (
                  <div key={day.toString()} className="text-center">
                    <div className="font-display font-bold text-gray-800 text-lg">
                      {format(day, 'EEE', { locale: es })}
                    </div>
                    <div className="font-body text-sm text-gray-600">
                      {format(day, 'd MMM', { locale: es })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Filas de horas */}
              {HOURS.map((hour, hourIdx) => (
                <motion.div
                  key={hour}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: hourIdx * 0.05 }}
                  className="grid grid-cols-8 gap-4 mb-4"
                >
                  {/* Hora */}
                  <div className="w-20 flex items-center justify-end pr-4">
                    <span className="font-body text-gray-600 font-semibold">
                      {hour}
                    </span>
                  </div>

                  {/* Celdas */}
                  {weekDays.map(day => {
                    const dayStr = format(day, 'yyyy-MM-dd');
                    const slotData = getSlotData(dayStr, hour);
                    
                    return (
                      <SlotButton
                        key={`${dayStr}-${hour}`}
                        day={dayStr}
                        hour={hour}
                        color={slotData?.color as PastelColor}
                        label={slotData?.label}
                        isOwner={isOwner}
                        onClick={() => handleSlotClick(dayStr, hour)}
                      />
                    );
                  })}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ColorPickerModal
        isOpen={showColorPicker}
        onClose={() => {
          setShowColorPicker(false);
          setSelectedSlot(null);
        }}
        onSelectColor={handleColorSelect}
      />

      <LabelPicker
        isOpen={showLabelPicker}
        onClose={() => {
          setShowLabelPicker(false);
          setSelectedColor(null);
        }}
        onSelectLabel={handleLabelSelect}
      />
    </div>
  );
}
