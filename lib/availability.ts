export const HOURS = Array.from({ length: 24 }, (_, i) =>
  ${String(i).padStart(2, '0')}:00
);

export type Range = {
  start: string;
  end: string;
};

export function isInRange(hour: string, range: Range) {
  return hour >= range.start && hour < range.end;
}
