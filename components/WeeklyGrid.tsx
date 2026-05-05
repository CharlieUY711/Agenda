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

const CORE_HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00'
];

export default function WeeklyGrid() {
  const [currentDate] = useState(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedColor, setSelectedColor] = useState<PastelColor | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  
  // Estados de expansión jerárquica
  const [earlyExpansion, setEarlyExpansion] = useState<'collapsed' | 'semi' | 'full'>('collapsed');
  const [lateExpansion, setLateExpansion] = useState<'collapsed' | 'semi' | 'full'>('collapsed');

  const { fingerprint } = useFingerprint();
  const { isOwner, isLoading: ownerLoading } = useOwner();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    async function loadSlots() {
      const data = await getWeeklySlots(currentDate);
      console.log('📊 Slots cargados:', data.length);
      setSlots(data);
    }
    loadSlots();
  }, [currentDate]);

  const handleSlotClick = async (day: string, hour: string) => {
    if (!isOwner) {
      console.log('⛔ No eres dueño');
      return;
    }

    if (!selectedColor || !selectedLabel) {
      console.log('⚠️ Primero selecciona un color y un ícono');
      return;
    }
    
    if (!fingerprint) {
      console.error('❌ No fingerprint');
      return;
    }

    const newSlot = await toggleSlot(day, hour, fingerprint, selectedColor, selectedLabel);

    if (newSlot) {
      console.log('✅ Guardado exitoso');
      setSlots(prev => {
        const filtered = prev.filter(s => !(s.day === day && s.hour === hour));
        return [...filtered, newSlot];
      });
    }
  };

  const handleGroupClick = (label: string) => {
    if (label === '00-07') {
      setEarlyExpansion('semi');
    } else if (label === '00-03' || label === '04-07') {
      setEarlyExpansion('full');
    } else if (label === '19-24') {
      setLateExpansion('semi');
    } else if (label === '19-21' || label === '22-24') {
      setLateExpansion('full');
    }
  };

  const getSlotData = (day: string, hour: string) => {
    return slots.find(s => s.day === day && s.hour === hour);
  };

  const renderHourRow = (hour: string, isGroup: boolean = false, groupLabel?: string) => (
    <motion.div
      key={hour}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center mb-1"
    >
      <div className="w-14 flex-shrink-0 flex items-center justify-end mr-3">
        <span className="font-body text-gray-600 font-semibold text-xs">
          {hour}
        </span>
      </div>
      <div className="flex gap-1 flex-1">
        {weekDays.map(day => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const slotData = getSlotData(dayStr, hour);
          
          return (
            <div key={`${dayStr}-${hour}`} className="w-32 flex-shrink-0">
              {isGroup ? (
                <button
                  onClick={() => handleGroupClick(groupLabel || hour)}
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
    </motion.div>
  );

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
    <div className="min-h-screen bg-white p-2 md:p-3">
      <div className="max-w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-3"
        >
          <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pastel-pink via-pastel-lavender to-pastel-blue mb-1">
            Mi Agenda Semanal
          </h1>
          <p className="text-gray-600 font-body text-xs">
            {isOwner ? '✨ Selecciona color e ícono, luego toca las celdas' : '👀 Modo solo lectura'}
          </p>
        </motion.div>

        <div className="flex items-start">
          {isOwner && (
            <ColorPanel
              selectedColor={selectedColor}
              selectedLabel={selectedLabel}
              onColorSelect={setSelectedColor}
              onLabelSelect={setSelectedLabel}
            />
          )}

          <div className="flex-1 bg-gradient-to-br from-pastel-pink/10 via-pastel-lavender/10 to-pastel-blue/10 rounded-xl p-2 shadow-soft">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="flex items-start mb-2">
                  <div className="w-14 flex-shrink-0 mr-3">
                    <div className="text-right">
                      <span className="font-display font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-pastel-pink to-pastel-lavender">
                        {format(weekStart, 'MMMM', { locale: es })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-1">
                    {weekDays.map(day => (
                      <div key={day.toString()} className="w-32 flex-shrink-0 text-center">
                        <div className="font-display font-bold text-gray-800 text-xs">
                          {format(day, 'EEEE d', { locale: es })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-200 mb-2" />

                {/* Horas tempranas - Expansión jerárquica */}
                <AnimatePresence mode="wait">
                  {earlyExpansion === 'collapsed' && (
                    <>{renderHourRow('00-07', true, '00-07')}</>
                  )}
                  
                  {earlyExpansion === 'semi' && (
                    <>
                      {renderHourRow('00-03', true, '00-03')}
                      {renderHourRow('04-07', true, '04-07')}
                    </>
                  )}
                  
                  {earlyExpansion === 'full' && (
                    <>
                      {renderHourRow('00:00')}
                      {renderHourRow('01:00')}
                      {renderHourRow('02:00')}
                      {renderHourRow('03:00')}
                      {renderHourRow('04:00')}
                      {renderHourRow('05:00')}
                      {renderHourRow('06:00')}
                      {renderHourRow('07:00')}
                    </>
                  )}
                </AnimatePresence>

                {/* Horas principales */}
                {CORE_HOURS.map(hour => renderHourRow(hour))}

                {/* Horas tardías - Expansión jerárquica */}
                <AnimatePresence mode="wait">
                  {lateExpansion === 'collapsed' && (
                    <>{renderHourRow('19-24', true, '19-24')}</>
                  )}
                  
                  {lateExpansion === 'semi' && (
                    <>
                      {renderHourRow('19-21', true, '19-21')}
                      {renderHourRow('22-24', true, '22-24')}
                    </>
                  )}
                  
                  {lateExpansion === 'full' && (
                    <>
                      {renderHourRow('19:00')}
                      {renderHourRow('20:00')}
                      {renderHourRow('21:00')}
                      {renderHourRow('22:00')}
                      {renderHourRow('23:00')}
                      {renderHourRow('24:00')}
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
