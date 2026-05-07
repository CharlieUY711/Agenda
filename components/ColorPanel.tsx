'use client';

import { motion } from 'framer-motion';
import { PastelColor, Label } from '@/types';
import { useAgenda } from '@/context/AgendaContext';

const colorOptions: { color: PastelColor; bgClass: string }[] = [
  { color: 'pink', bgClass: 'bg-pastel-pink' },
  { color: 'lavender', bgClass: 'bg-pastel-lavender' },
  { color: 'blue', bgClass: 'bg-pastel-blue' },
  { color: 'mint', bgClass: 'bg-pastel-mint' },
  { color: 'yellow', bgClass: 'bg-pastel-yellow' },
  { color: 'peach', bgClass: 'bg-pastel-peach' },
  { color: 'rose', bgClass: 'bg-pastel-rose' },
  { color: 'lilac', bgClass: 'bg-pastel-lilac' },
];

const labelOptions: Label[] = ['✓', '★', '♥', '◆', '●', '▲', '■', '✕'];

export default function ColorPanel() {
  const {
    selectedColor,
    selectedLabel,
    setSelectedColor,
    setSelectedLabel,
  } = useAgenda();

  return (
    <div className="w-32">

      {/* HEADER */}
      <div className="text-xs text-gray-500 mb-2 text-center">
        Opciones
      </div>

      {/* GRID 2 COLUMNAS */}
      <div className="grid grid-cols-2 gap-2">

        {/* COLORES */}
        <div className="flex flex-col gap-2">
          {colorOptions.map(({ color, bgClass }) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedColor(color)}
              className={`
                ${bgClass}
                w-full h-8 rounded-lg
                ${selectedColor === color ? 'ring-2 ring-black' : ''}
              `}
            />
          ))}
        </div>

        {/* ICONOS */}
        <div className="flex flex-col gap-2">
          {labelOptions.map((label) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedLabel(label)}
              className={`
                w-full h-8 rounded-lg border
                flex items-center justify-center
                text-sm font-bold
                ${
                  selectedLabel === label
                    ? 'bg-gray-200 border-gray-400'
                    : 'bg-white border-gray-200'
                }
              `}
            >
              {label}
            </motion.button>
          ))}
        </div>

      </div>
    </div>
  );
}