'use client';

import { PastelColor, Label } from '@/types';

interface CompactActionBarProps {
  selectedColor: PastelColor | null;
  selectedLabel: Label | null;
  onColorSelect: (color: PastelColor) => void;
  onLabelSelect: (label: Label) => void;
}

const COLORS: PastelColor[] = ['pink', 'lavender', 'blue', 'mint', 'yellow', 'peach', 'rose', 'lilac'];
const LABELS: Label[] = ['✓', '★', '♥', '◆', '●', '▲', '■', '✕'];

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

export default function CompactActionBar({
  selectedColor,
  selectedLabel,
  onColorSelect,
  onLabelSelect,
}: CompactActionBarProps) {
  return (
    <div className="sticky top-20 w-14 flex flex-col gap-1.5 bg-white/95 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-gray-100">

      {/* Sección de colores */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[7px] font-display font-semibold text-gray-500 text-center leading-none px-0.5">
          Color
        </span>
        <div className="grid grid-cols-2 gap-0.5 px-0.5">
          {COLORS.map(color => (
            <button
              key={color}
              onClick={() => onColorSelect(color)}
              className={`
                ${colorClasses[color]}
                w-5 h-5 rounded transition-all
                ${selectedColor === color ? 'ring-1 ring-gray-800' : 'hover:opacity-80'}
              `}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Separador */}
      <div className="h-px bg-gray-200 mx-1" />

      {/* Sección de íconos */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[7px] font-display font-semibold text-gray-500 text-center leading-none px-0.5">
          Ícono
        </span>
        <div className="grid grid-cols-2 gap-0.5 px-0.5">
          {LABELS.map(label => (
            <button
              key={label}
              onClick={() => onLabelSelect(label)}
              className={`
                w-5 h-5 rounded bg-gray-50 border transition-all
                flex items-center justify-center text-[9px] font-bold
                ${selectedLabel === label
                  ? 'border-gray-800 bg-gray-100'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              title={label}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
