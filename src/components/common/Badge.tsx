import React from 'react';
import { ProjectStatus } from '../../types';

interface BadgeProps {
  status: ProjectStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, size = 'md' }) => {
  const getStyle = (s: string) => {
    switch (s) {
      case 'Completed':
        return 'bg-[#0A0A0A] text-[#00FF41] border-[#00FF41]/40';
      case 'In Development':
        return 'bg-[#0A0A0A] text-[#FFB800] border-[#FFB800]/40';
      case 'Prototyping':
        return 'bg-[#0A0A0A] text-[#FFB800] border-[#FFB800]/50';
      case 'Testing':
        return 'bg-[#0A0A0A] text-purple-400 border-purple-500/40';
      case 'Research':
      case 'Planning':
        return 'bg-[#0A0A0A] text-sky-400 border-sky-500/40';
      case 'Archived':
        return 'bg-[#0A0A0A] text-[#666] border-[#222]';
      default:
        return 'bg-[#0A0A0A] text-[#E0E0E0] border-[#222]';
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-xs',
  };

  return (
    <span className={`inline-flex items-center font-mono font-bold uppercase tracking-wider border ${getStyle(status)} ${sizeClasses[size]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      [{status.toUpperCase()}]
    </span>
  );
};
