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
 * 1px Sky Blue border (#C5E5FF), 16px rounded corners, compact circular NashkaIconBadge,
 * and optional inline/stacked action area.
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
  const surfaceClass =
    surface === 'soft' ? 'bg-[var(--color-soft-bg)]' : 'bg-[var(--color-white)]';

  const outerLayoutClass = centered
    ? 'flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-right'
    : stackActionOnDesktop
      ? 'flex flex-col md:flex-row lg:flex-col items-center md:items-center lg:items-stretch justify-between gap-4 sm:gap-5'
      : 'flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4';

  const contentLayoutClass = centered
    ? 'flex flex-col sm:flex-row items-center gap-3 text-center sm:text-right min-w-0'
    : 'flex flex-col sm:flex-row items-center sm:items-start gap-3.5 text-center sm:text-right min-w-0';

  const actionWrapperClass = stackActionOnDesktop
    ? 'w-full md:w-auto lg:w-full shrink-0'
    : 'w-full sm:w-auto shrink-0';

  return (
    <div
      className={`group rounded-2xl border border-[var(--color-secondary)] shadow-[var(--shadow-card)] p-4 sm:p-5 lg:p-6 transition-[box-shadow,border-color] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#9FD3FF] motion-reduce:transition-none ${surfaceClass} ${className}`}
    >
      <div className={outerLayoutClass}>
        <div className={contentLayoutClass}>
          <NashkaIconBadge icon={icon} size="compact" />
          <div className="min-w-0">
            {title && (
              <h3 className="text-[15.5px] sm:text-base lg:text-[17px] font-bold text-[var(--color-primary)] leading-[1.45] mb-1">
                {title}
              </h3>
            )}
            <div className="text-[13px] sm:text-sm text-[#5A657D] leading-[1.8] [text-wrap:balance]">
              {children}
            </div>
          </div>
        </div>

        {action && <div className={actionWrapperClass}>{action}</div>}
      </div>
    </div>
  );
}
