'use client';

import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import SlotButton from './SlotButton';
import ColorPickerModal from './ColorPickerModal';
import { getWeeklySlots, toggleSlot } from '@/lib/database';
import { useFingerprint } from '@/hooks/useFingerprint';
import { useOwner } from '@/hooks/useOwner';
import { Slot, PastelColor } from '@/types';

const HOURS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00', '22:00', '23:00', '24:00'
];

export default function WeeklyGrid() {
  const [currentDate] = useState(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; hour: string } | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

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

  const handleSlotClick = (day: string, hour: string) => {
    if (!isOwner) {
      console.log('⛔ No eres dueño');
      return;
    }
    
    console.log('🖱️ Slot clicked:', { day, hour });
    setSelectedSlot({ day, hour });
    setShowColorPicker(true);
  };

  const handleColorSelect = async (color: PastelColor) => {
    console.log('🎨 Color selected:', color);
    
    if (!selectedSlot || !fingerprint) {
      console.error('❌ Missing data:', { selectedSlot, fingerprint });
      return;
    }

    console.log('💾 Guardando con color:', color);

    // Guardar directamente con el color, sin etiqueta
    const newSlot = await toggleSlot(
      selectedSlot.day,
      selectedSlot.hour,
      fingerprint,
      color,
      '✓' // Etiqueta por defecto
    );

    if (newSlot) {
      console.log('✅ Guardado exitoso:', newSlot);
      
      // Actualizar estado local
      setSlots(prev => {
        const filtered = prev.filter(
          s => !(s.day === selectedSlot.day && s.hour === selectedSlot.hour)
        );
        return [...filtered, newSlot];
      });
    } else {
      console.error('❌ Error al guardar');
    }

    // Cerrar modal y limpiar
    setShowColorPicker(false);
    setSelectedSlot(null);
  };

  const handleCancel = () => {
    console.log('🚫 Cancelado');
    setShowColorPicker(false);
    setSelectedSlot(null);
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
    <div className="min-h-screen bg-white p-2 md:p-3">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-3"
        >
          <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pastel-pink via-pastel-lavender to-pastel-blue mb-1">
            Mi Agenda Semanal
          </h1>
          <p className="text-gray-600 font-body text-xs">
            {isOwner ? '✨ Toca una celda y elige un color' : '👀 Modo solo lectura'}
          </p>
        </motion.div>

        <div className="bg-gradient-to-br from-pastel-pink/10 via-pastel-lavender/10 to-pastel-blue/10 rounded-xl p-2 shadow-soft">
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <div className="grid grid-cols-8 gap-1 mb-1">
                <div className="w-12" />
                {weekDays.map(day => (
                  <div key={day.toString()} className="text-center px-1">
                    <div className="font-display font-bold text-gray-800 text-xs">
                      {format(day, 'EEEE', { locale: es })}
                    </div>
                    <div className="font-body text-xs text-gray-600">
                      {format(day, 'd MMMM', { locale: es })}
                    </div>
                  </div>
                ))}
              </div>

              {HOURS.map((hour, hourIdx) => (
                <motion.div
                  key={hour}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: hourIdx * 0.01 }}
                  className="grid grid-cols-8 gap-1 mb-1"
                >
                  <div className="w-12 flex items-center justify-end pr-1">
                    <span className="font-body text-gray-600 font-semibold text-xs">
                      {hour}
                    </span>
                  </div>

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

      <ColorPickerModal
        isOpen={showColorPicker}
        onClose={handleCancel}
        onSelectColor={handleColorSelect}
      />
    </div>
  );
}
