import React from 'react';
import { NashkaIconComponent } from './NashkaIcon';
import { NashkaIconBadge } from './NashkaIconBadge';

interface NashkaNoticeCardProps {
  icon: NashkaIconComponent;
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  surface?: 'white' | 'soft';
  centered?: boolean;
  stackActionOnDesktop?: boolean;
  className?: string;
}

/**
 * NashkaNoticeCard
 * Standardized RTL notice and commitment container:
 * Soft Gray border (#E8EDF4), 16px Deep Black/Slate copy,
 * and clean single-level elevation.
 */
export function NashkaNoticeCard({
  icon,
  title,
  children,
  action,
  surface = 'white',
  centered = false,
  stackActionOnDesktop = false,
  className = '',
}: NashkaNoticeCardProps) {
  const surfaceClass = surface === 'soft' ? 'bg-[#F4F8FC]' : 'bg-white';

  const outerLayoutClass = centered
    ? 'flex flex-col sm:flex-row items-center justify-center gap-3.5 text-center sm:text-right'
    : stackActionOnDesktop
      ? 'flex flex-col md:flex-row lg:flex-col items-center md:items-center lg:items-stretch justify-between gap-4 sm:gap-5'
      : 'flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4';

  const contentLayoutClass = centered
    ? 'flex flex-col sm:flex-row items-center gap-3.5 text-center sm:text-right min-w-0'
    : 'flex flex-col sm:flex-row items-center sm:items-start gap-3.5 text-center sm:text-right min-w-0';

  const actionWrapperClass = stackActionOnDesktop
    ? 'w-full md:w-auto lg:w-full shrink-0'
    : 'w-full sm:w-auto shrink-0';

  return (
    <div
      className={`group rounded-2xl border border-[#E8EDF4] shadow-[var(--shadow-card)] p-4 sm:p-5 lg:p-6 transition-[box-shadow,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#C5E5FF] motion-reduce:transition-none ${surfaceClass} ${className}`}
    >
      <div className={outerLayoutClass}>
        <div className={contentLayoutClass}>
          <NashkaIconBadge icon={icon} size="compact" />
          <div className="min-w-0">
            {title && (
              <h3 className="text-base sm:text-[17px] font-bold text-[#0B0B0D] leading-[1.35] mb-1">
                {title}
              </h3>
            )}
            <div className="text-[14px] sm:text-[15px] text-[#475569] leading-[1.6] [text-wrap:balance]">
              {children}
            </div>
          </div>
        </div>

        {action && <div className={actionWrapperClass}>{action}</div>}
      </div>
    </div>
  );
}
