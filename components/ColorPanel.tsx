'use client';

import { motion } from 'framer-motion';
import { PastelColor, Label } from '@/types';

interface ColorPanelProps {
  selectedColor: PastelColor | null;
  selectedLabel: Label | null;
  onColorSelect: (color: PastelColor) => void;
  onLabelSelect: (label: Label) => void;
}

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

export default function ColorPanel({
  selectedColor,
  selectedLabel,
  onColorSelect,
  onLabelSelect,
}: ColorPanelProps) {
  return (
    <div className="flex-shrink-0 w-24 mr-4">
      <div className="sticky top-4">
        {/* Título */}
        <div className="text-center mb-3">
          <h3 className="text-xs font-display font-bold text-gray-600 mb-1">
            Colores
          </h3>
        </div>

        {/* Grid de colores */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {colorOptions.map(({ color, bgClass }) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onColorSelect(color)}
              className={`
                ${bgClass}
                ${selectedColor === color ? 'ring-2 ring-gray-800 ring-offset-2' : 'ring-1 ring-gray-200'}
                w-full h-10 rounded-lg transition-all shadow-soft
                hover:shadow-soft-hover
              `}
            />
          ))}
        </div>

        {/* Título emojis */}
        <div className="text-center mb-3 mt-6">
          <h3 className="text-xs font-display font-bold text-gray-600 mb-1">
            Íconos
          </h3>
        </div>

        {/* Grid de emojis */}
        <div className="grid grid-cols-2 gap-2">
          {labelOptions.map((label) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onLabelSelect(label)}
              className={`
                ${selectedLabel === label ? 'bg-gray-200 ring-2 ring-gray-800' : 'bg-white border border-gray-200'}
                w-full h-10 rounded-lg transition-all
                flex items-center justify-center
                font-display font-bold text-gray-800 text-sm
                hover:bg-gray-100
              `}
            >
              {label}
            </motion.button>
          ))}
        </div>

        {/* Indicador de selección actual */}
        {selectedColor && selectedLabel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-2 bg-white rounded-lg border border-gray-200 text-center"
          >
            <div className="text-[10px] text-gray-500 mb-1">Seleccionado:</div>
            <div className={`${colorOptions.find(c => c.color === selectedColor)?.bgClass} w-full h-8 rounded flex items-center justify-center text-sm font-bold`}>
              {selectedLabel}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
