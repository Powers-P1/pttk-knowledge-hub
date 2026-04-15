import type { SourceConfidence } from '../types';
import { confidenceConfig } from '../lib/utils';

interface Props {
  confidence: SourceConfidence;
  size?: 'sm' | 'md';
}

export default function ConfidenceBadge({ confidence, size = 'sm' }: Props) {
  const config = confidenceConfig[confidence];
  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5'
    : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium border ${config.bg} ${config.color} ${config.border} ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
