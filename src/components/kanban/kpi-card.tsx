type KpiCardProps = {
  title: string;
  value: number;
  description: string;
  variant?: 'danger' | 'warning' | 'info' | 'neutral' | 'success';
};

const variantStyles = {
  danger: 'border-red-500/30 bg-red-950/20 text-red-300',
  warning: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
  info: 'border-blue-500/30 bg-blue-950/20 text-blue-300',
  neutral: 'border-slate-700 bg-[#111111] text-slate-300',
  success: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300',
};

export function KpiCard({
  title,
  value,
  description,
  variant = 'neutral',
}: KpiCardProps) {
  return (
    <div
      className={`rounded-2xl border p-4 transition hover:border-white/20 ${variantStyles[variant]}`}
    >
      <p className="text-sm font-medium">{title}</p>
      <strong className="mt-2 block text-3xl font-semibold text-white">
        {value}
      </strong>
      <span className="text-xs opacity-70">{description}</span>
    </div>
  );
}