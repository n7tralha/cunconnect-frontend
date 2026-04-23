import React from 'react';
import { Award, Star, Trophy, Crown, Sparkles } from 'lucide-react';

export default function ReputationBadge({ level, size = 'md' }) {
  const getReputationData = (level) => {
    if (level >= 1000) {
      return { label: 'Leyenda', className: 'reputation-legend', icon: Crown };
    } else if (level >= 500) {
      return { label: 'Experto', className: 'reputation-expert', icon: Trophy };
    } else if (level >= 200) {
      return { label: 'Establecido', className: 'reputation-established', icon: Award };
    } else if (level >= 50) {
      return { label: 'En Ascenso', className: 'reputation-rising', icon: Star };
    } else {
      return { label: 'Principiante', className: 'reputation-beginner', icon: Sparkles };
    }
  };

  const reputation = getReputationData(level || 0);
  const Icon = reputation.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${reputation.className} ${sizeClasses[size]}`}>
      <Icon size={iconSizes[size]} />
      {reputation.label}
    </span>
  );
}