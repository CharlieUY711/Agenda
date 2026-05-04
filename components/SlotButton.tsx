'use client';

import { motion } from 'framer-motion';
import { PastelColor } from '@/types';

interface SlotButtonProps {
  day: string;
  hour: string;
  color?: PastelColor;
  label?: string;
  isOwner: boolean;
  onClick: () => void;
}

const colorClasses: Record<PastelColor, string> = {
  pink: 'bg-pastel-pink',
  lavender: 'bg-pastel-lavender',
  blue: 'bg-pastel-blue',
  mint: 'bg-pastel-mint',
  yellow: 'bg-pastel-yellow',
  peach: 'bg-pastel-peach',
  rose: 'bg-pastel-rose',
  lilac: 'bg-pastel-lilac',
};

export default function SlotButton({ 
  day, 
  hour, 
  color, 
  label, 
  isOwner, 
  onClick 
}: SlotButtonProps) {
  const bgClass = color ? colorClasses[color] : 'bg-white';
  const hasContent = color && label;

  return (
    <motion.button
      whileHover={isOwner ? { scale: 1.05 } : {}}
      whileTap={isOwner ? { scale: 0.95 } : {}}
      onClick={isOwner ? onClick : undefined}
      disabled={!isOwner}
      className={`
        ${bgClass}
        ${hasContent ? 'shadow-soft' : 'border border-gray-100'}
        ${isOwner ? 'cursor-pointer hover:shadow-soft-hover' : 'cursor-not-allowed opacity-75'}
        w-full h-8 rounded-xl transition-all duration-300
        flex items-center justify-center
        font-display font-bold text-gray-800
      `}
    >
      {label && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs"
        >
          {label}
        </motion.span>
      )}
    </motion.button>
  );
}
