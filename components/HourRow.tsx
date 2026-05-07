import { format } from 'date-fns';

type Props = {
  hour: string;
  weekDays: Date[];
};

export default function HourRow({ hour, weekDays }: Props) {
  return (
    <div className="flex items-center mb-1">

      {/* HOUR */}
      <div className="w-14 text-right pr-2 text-xs text-gray-600">
        {hour}
      </div>

      {/* CELLS */}
      <div className="flex gap-1 flex-1">
        {weekDays.map(day => {
          const key = `${format(day, 'yyyy-MM-dd')}-${hour}`;

          return (
            <div
              key={key}
              className="w-32 h-8 rounded-lg border border-gray-200 bg-white"
            />
          );
        })}
      </div>

      {/* SPACER */}
      <div className="w-14" />
    </div>
  );
}