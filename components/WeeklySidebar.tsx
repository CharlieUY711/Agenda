'use client';

import { PastelColor, Label } from '@/types';

type Props = {
  selectedColor: PastelColor | null;
  selectedLabel: Label | null;
  onColorSelect: (c: PastelColor) => void;
  onLabelSelect: (l: Label) => void;
  editMode: boolean;
};

const COLORS: PastelColor[] = [
  'pink',
  'purple',
  'blue',
  'green',
  'yellow',
  'orange',
];

const LABELS: Label[] = ['✓', '★', '♥', '!', '⚡', '●'];

export default function WeeklySidebar({
  selectedColor,
  selectedLabel,
  onColorSelect,
  onLabelSelect,
  editMode,
}: Props) {
  if (!editMode) return null;

  return (
    <div className="w-14 flex flex-col items-center gap-3
                    bg-white/60 backdrop-blur-md
                    border border-gray-200
                    rounded-xl shadow-sm
                    py-2">

      {/* COLORS */}
      <div className="flex flex-col gap-1">
        {COLORS.map(color => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className={`w-4 h-4 rounded-full transition-all
              ${selectedColor === color ? 'scale-125 ring-2 ring-gray-400' : ''}
              bg-${color}-300`}
          />
        ))}
      </div>

      {/* DIVIDER */}
      <div className="w-6 h-px bg-gray-200" />

      {/* ICONS */}
      <div className="flex flex-col gap-1 text-xs">
        {LABELS.map(label => (
          <button
            key={label}
            onClick={() => onLabelSelect(label)}
            className={`w-6 h-6 flex items-center justify-center rounded-md
              transition-all hover:bg-gray-100
              ${selectedLabel === label ? 'bg-gray-200' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

    </div>
  );
}