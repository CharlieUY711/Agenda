export function addOneHour(hour: string) {
  const [h] = hour.split(':');
  const next = (parseInt(h) + 1).toString().padStart(2, '0');
  return ${next}:00;
}
