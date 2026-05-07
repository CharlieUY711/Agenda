'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/types';

interface LabelPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLabel: (label: Label) => void;
}

const labelOptions: Label[] = [
  'Gol',
  'Entrega',
  'Retiro',
  'OK',
  'Listo',
  '✓',
  '★',
  '♥',
];

export default function LabelPicker({ isOpen, onClose, onSelectLabel }: LabelPickerProps) {
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
              Elige una etiqueta
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {labelOptions.map((label) => (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onSelectLabel(label);
                    onClose();
                  }}
                  className="bg-gradient-to-br from-pastel-pink to-pastel-lavender text-gray-800 font-display font-semibold py-3 px-4 rounded-2xl shadow-soft hover:shadow-soft-hover transition-all"
                >
                  {label}
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
