interface Props {
  label: string;
  variant?: 'default' | 'warning' | 'success' | 'danger' | 'info';
}

const variantClasses = {
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
};

export default function Pill({ label, variant = 'default' }: Props) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full border ${variantClasses[variant]}`}>
      {label}
    </span>
  );
}
