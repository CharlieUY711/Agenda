export interface Slot {
  id?: string;
  day: string; // formato ISO date
  hour: string; // formato "08:00", "09:00", etc.
  color: string;
  label: string;
  updated_by: string;
}

export interface SlotUpdate {
  color: string;
  label: string;
}

export type PastelColor = 
  | 'pink'
  | 'lavender'
  | 'blue'
  | 'mint'
  | 'yellow'
  | 'peach'
  | 'rose'
  | 'lilac';

export interface ColorOption {
  name: string;
  value: PastelColor;
  bgClass: string;
}

export type Label = 
  | 'Gol'
  | 'Entrega'
  | 'Retiro'
  | 'OK'
  | 'Listo'
  | '✓'
  | '★'
  | '♥';
