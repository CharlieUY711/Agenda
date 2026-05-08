'use client';

import { useState, useEffect, useRef } from 'react';
import { format, startOfWeek, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import SlotButton from './SlotButton';
import { getWeeklySlots, toggleSlot } from '@/lib/database';
import { useFingerprint } from '@/hooks/useFingerprint';
import { useOwner } from '@/hooks/useOwner';
import { Slot, PastelColor, Label } from '@/types';

const CORE_HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00'
];

const ALL_HOURS = Array.from({ length: 24 }, (_, i) => 
  `${i.toString().padStart(2, '0')}:00`
);

const EARLY_MORNING_1 = ['00:00', '01:00', '02:00', '03:00'];
const EARLY_MORNING_2 = ['04:00', '05:00', '06:00', '07:00'];
const EVENING_1 = ['19:00', '20:00', '21:00'];
const EVENING_2 = ['22:00', '23:00', '24:00'];

export default function WeeklyGrid() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedColor, setSelectedColor] = useState<PastelColor | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  
  const [earlyExpansion, setEarlyExpansion] = useState<'collapsed' | 'semi' | 'full'>('collapsed');
  const [lateExpansion, setLateExpansion] = useState<'collapsed' | 'semi' | 'full'>('collapsed');

  const [editMode, setEditMode] = useState(false);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});

  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const [isPressing, setIsPressing] = useState(false);

  const { fingerprint } = useFingerprint();
  const { isOwner, isLoading: ownerLoading } = useOwner();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    loadWeeklySlots();
  }, [currentDate]);

  const loadWeeklySlots = async () => {
    const data = await getWeeklySlots(currentDate);
    setSlots(data);
  };

  const getSlotData = (day: string, hour: string): Slot | undefined => {
    return slots.find(s => s.day === day && s.hour === hour);
  };

  const handleSlotClick = async (day: string, hour: string) => {
    if (!isOwner || editMode) return;
    if (!selectedColor || !selectedLabel) {
      alert('Por favor selecciona un color y un ícono primero');
      return;
    }
    
    if (fingerprint) {
      await toggleSlot(day, hour, fingerprint, selectedColor, selectedLabel);
      await loadWeeklySlots();
    }
  };

  const goToPreviousWeek = () => {
    setCurrentDate(prev => subDays(prev, 7));
  };

  const goToNextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7));
  };

  const handleGroupClick = (groupLabel: string) => {
    if (groupLabel === '00-07') {
      setEarlyExpansion(prev => 
        prev === 'collapsed' ? 'semi' : prev === 'semi' ? 'full' : 'collapsed'
      );
    } else if (groupLabel === '19-24') {
      setLateExpansion(prev => 
        prev === 'collapsed' ? 'semi' : prev === 'semi' ? 'full' : 'collapsed'
      );
    }
  };

  const handleGroupMouseDown = (groupLabel: string) => {
    setIsPressing(true);
    pressTimer.current = setTimeout(() => {
      if (groupLabel === '00-07') {
        setEarlyExpansion('collapsed');
      } else if (groupLabel === '19-24') {
        setLateExpansion('collapsed');
      }
      setIsPressing(false);
    }, 500);
  };

  const handleGroupMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    setIsPressing(false);
  };

  const handleSaveConfiguration = () => {
    console.log('Guardar configuración:', availability);
    setEditMode(false);
  };

  const renderRow = (
  hour: string,
  isGroup: boolean = false,
  groupLabel?: string
) => {
  return (
    <motion.div
      key={`row-${hour}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center mb-1"
    >
      {/* HOUR */}
      <div className="w-14 flex-shrink-0 flex items-center justify-end mr-3">
        <span className="font-body text-gray-600 font-semibold text-xs">
          {hour}
        </span>
      </div>

      {/* GRID */}
      <div className="flex gap-1 flex-1">
        {weekDays.map((day) => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const slotData = getSlotData(dayStr, hour);

          return (
            <div key={`${dayStr}-${hour}`} className="w-32 flex-shrink-0">
              {isGroup ? (
                <button
                  onClick={() => handleGroupClick(groupLabel || hour)}
                  onMouseDown={() =>
                    handleGroupMouseDown(groupLabel || hour)
                  }
                  onMouseUp={handleGroupMouseUp}
                  onMouseLeave={handleGroupMouseUp}
                  className="w-full h-8 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <span className="text-[10px] text-gray-400">•</span>
                </button>
              ) : (
                <SlotButton
                  day={dayStr}
                  hour={hour}
                  color={slotData?.color as PastelColor}
                  label={slotData?.label}
                  isOwner={isOwner}
                  onClick={() => handleSlotClick(dayStr, hour)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* RIGHT SPACER */}
<div className="flex-shrink-0 ml-3 flex items-center justify-center pl-1 pr-1">
  {CORE_HOURS.includes(hour) ? (
    <div className="flex items-center gap-2">
      <button className="w-8 h-8 bg-green-100 hover:bg-green-200 rounded-md border border-green-200 transition-colors" />
      <button className="w-8 h-8 bg-green-100 hover:bg-green-200 rounded-md border border-green-200 transition-colors" />
    </div>
  ) : null}
</div>    

   </motion.div>
  );
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
    <div className="min-h-screen bg-white p-2 md:p-3 flex items-start justify-center">
      <div className="w-full max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-3"
        >
          <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pastel-pink via-pastel-lavender to-pastel-blue mb-1">
            Mi Agenda Semanal
          </h1>
          <p className="text-gray-600 font-body text-xs">
            {editMode 
              ? '⚙️ Modo configuración: Marca tu disponibilidad semanal'
              : isOwner ? '✨ Selecciona color e ícono, luego toca las celdas' : '👀 Modo solo lectura'
            }
          </p>

          {isOwner && (
            <div className="flex gap-2 justify-center mt-3">
              <button
                onClick={() => setEditMode(!editMode)}
                className={`
                  px-4 py-2 rounded-lg font-display font-semibold text-sm
                  transition-all
                  ${editMode 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                  }
                `}
              >
                {editMode ? 'Finalizar edición' : 'Configurar disponibilidad'}
              </button>

              {editMode && (
                <button
                  onClick={handleSaveConfiguration}
                  className="px-4 py-2 rounded-lg font-display font-semibold text-sm bg-green-500 text-white hover:bg-green-600 transition-all"
                >
                  Guardar configuración
                </button>
              )}
            </div>
          )}
        </motion.div>

        <div className="bg-gradient-to-br from-pastel-pink/10 via-pastel-lavender/10 to-pastel-blue/10 rounded-xl p-2 shadow-soft inline-block relative">
           <div>
            <div className="flex items-start mb-2">
              <div className="w-14 flex-shrink-0 mr-3">
                <div className="text-right">
                  <span className="font-display font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-pastel-pink to-pastel-lavender">
                    {format(weekStart, 'MMMM', { locale: es })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center mb-2">
              <div className="w-14 flex-shrink-0 flex items-center justify-end mr-3">
                <button
                  onClick={goToPreviousWeek}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-lg"
                  title="Semana anterior"
                >
                  ←
                </button>
              </div>
              <div className="flex gap-1">
                {weekDays.map(day => (
                  <div key={day.toString()} className="w-32 flex-shrink-0 text-center">
                    <div className="font-display font-bold text-gray-800 text-xs">
                      {format(day, 'EEEE d', { locale: es })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-14 flex-shrink-0 ml-3 flex items-center justify-start">
                <button
                  onClick={goToNextWeek}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-lg"
                  title="Semana siguiente"
                >
                  →
                </button>
              </div>
            </div>

            {earlyExpansion !== 'collapsed' && (
              <>
                <AnimatePresence>
                  {earlyExpansion === 'full' && EARLY_MORNING_1.map(hour => renderRow(hour))}
                </AnimatePresence>
                <AnimatePresence>
                  {(earlyExpansion === 'semi' || earlyExpansion === 'full') && 
                    EARLY_MORNING_2.map(hour => renderRow(hour))
                  }
                </AnimatePresence>
              </>
            )}

            {earlyExpansion === 'collapsed' && renderRow('00-07', true, '00-07')}

            {CORE_HOURS.map(hour => renderRow(hour))}

            {lateExpansion === 'collapsed' && renderRow('19-24', true, '19-24')}

            {lateExpansion !== 'collapsed' && (
              <>
                <AnimatePresence>
                  {(lateExpansion === 'semi' || lateExpansion === 'full') && 
                    EVENING_1.map(hour => renderRow(hour))
                  }
                </AnimatePresence>
                <AnimatePresence>
                  {lateExpansion === 'full' && EVENING_2.map(hour => renderRow(hour))}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}