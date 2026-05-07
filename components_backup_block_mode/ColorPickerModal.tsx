'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ColorOption, PastelColor } from '@/types';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectColor: (color: PastelColor) => void;
}

const colorOptions: ColorOption[] = [
  { name: 'Rosa', value: 'pink', bgClass: 'bg-pastel-pink' },
  { name: 'Lavanda', value: 'lavender', bgClass: 'bg-pastel-lavender' },
  { name: 'Celeste', value: 'blue', bgClass: 'bg-pastel-blue' },
  { name: 'Menta', value: 'mint', bgClass: 'bg-pastel-mint' },
  { name: 'Amarillo', value: 'yellow', bgClass: 'bg-pastel-yellow' },
  { name: 'Durazno', value: 'peach', bgClass: 'bg-pastel-peach' },
  { name: 'Rosa Fuerte', value: 'rose', bgClass: 'bg-pastel-rose' },
  { name: 'Lila', value: 'lilac', bgClass: 'bg-pastel-lilac' },
];

export default function ColorPickerModal({ isOpen, onClose, onSelectColor }: ColorPickerModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-80 bg-white rounded-3xl shadow-soft-hover p-6"
          >
            <h3 className="text-2xl font-display font-bold text-gray-800 mb-4 text-center">
              Elige un color
            </h3>

            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map((color) => (
                <motion.button
                  key={color.value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onSelectColor(color.value);
                    onClose();
                  }}
                  className={`${color.bgClass} w-full aspect-square rounded-2xl shadow-soft hover:shadow-soft-hover transition-shadow flex items-center justify-center`}
                >
                  <span className="text-xs font-body text-gray-700 opacity-0 hover:opacity-100 transition-opacity">
                    {color.name}
                  </span>
                </motion.button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="mt-4 w-full py-2 text-gray-600 hover:text-gray-800 font-body text-sm transition-colors"
            >
              Cancelar
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
