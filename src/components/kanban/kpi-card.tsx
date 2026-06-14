type KpiCardProps = {
  title: string;
  value: number;
  description: string;
  variant?: 'danger' | 'warning' | 'info' | 'neutral' | 'success';
};

const variantStyles = {
  danger: 'border-red-900/50 bg-red-950/30 text-red-300',
  warning: 'border-amber-900/50 bg-amber-950/30 text-amber-300',
  info: 'border-blue-900/50 bg-blue-950/30 text-blue-300',
  neutral: 'border-slate-700 bg-slate-900 text-slate-300',
  success: 'border-emerald-900/50 bg-emerald-950/30 text-emerald-300',
};

export function KpiCard({
  title,
  value,
  description,
  variant = 'neutral',
}: KpiCardProps) {
  return (
    <div className={`rounded-2xl border p-4 ${variantStyles[variant]}`}>
      <p className="text-sm">{title}</p>
      <strong className="mt-2 block text-3xl text-white">{value}</strong>
      <span className="text-xs opacity-70">{description}</span>
    </div>
  );
}
