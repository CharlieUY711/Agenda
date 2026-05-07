'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { PastelColor, Label } from '@/types';

type AgendaContextType = {
  selectedColor: PastelColor | null;
  selectedLabel: Label | null;
  isReadOnly: boolean;
  setIsReadOnly: (v: boolean) => void;
  setSelectedColor: (c: PastelColor | null) => void;
  setSelectedLabel: (l: Label | null) => void;
};

const AgendaContext = createContext<AgendaContextType | null>(null);

export function AgendaProvider({ children }: { children: ReactNode }) {
  const [selectedColor, setSelectedColor] = useState<PastelColor | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  return (
    <AgendaContext.Provider
      value={{
        selectedColor,
        selectedLabel,
        isReadOnly,
        setIsReadOnly,
        setSelectedColor,
        setSelectedLabel,
      }}
    >
      {children}
    </AgendaContext.Provider>
  );
}

export function useAgenda() {
  const ctx = useContext(AgendaContext);
  if (!ctx) throw new Error('useAgenda must be used inside AgendaProvider');
  return ctx;
}
