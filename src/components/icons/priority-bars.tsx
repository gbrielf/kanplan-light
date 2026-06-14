type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export function PriorityBars({ priority }: { priority: Priority }) {
  if (priority === 'URGENT') {
    return <span className="text-red-500 font-bold">⚠</span>;
  }

  const bars = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
  };

  return (
    <div className="flex items-end gap-1">
      {[1, 2, 3].map((bar) => (
        <div
          key={bar}
          className={`
            w-1 rounded-full
            ${bar === 1 ? 'h-2' : bar === 2 ? 'h-3' : 'h-4'}
            ${bar <= bars[priority] ? 'bg-slate-300' : 'bg-slate-700'}
          `}
        />
      ))}
    </div>
  );
}
