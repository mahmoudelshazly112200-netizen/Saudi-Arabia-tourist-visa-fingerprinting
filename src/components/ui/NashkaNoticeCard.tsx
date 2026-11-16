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
 * Standardized NASHKA notice and commitment container:
 * Crisp white or soft-cloud frame with partial gold rim accent,
 * dual-ring Blue-Gold emblem, and subtle gold signature mark.
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
  const surfaceClass = surface === 'soft' ? 'bg-[#F3F7FC]' : 'bg-white';

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
    <div className={`group nashka-card nashka-card--notice ${surfaceClass} ${className}`}>
      <div className={outerLayoutClass}>
        <div className={contentLayoutClass}>
          <NashkaIconBadge icon={icon} size="compact" />
          <div className="min-w-0">
            {title && (
              <h3 className="text-[length:var(--text-h3)] font-bold text-[#17213B] leading-[1.35] mb-1.5">
                {title}
              </h3>
            )}
            <div className="text-[length:var(--text-body)] font-normal text-[#68758A] leading-[1.6] [text-wrap:balance]">
              {children}
            </div>
          </div>
        </div>

        {action && <div className={actionWrapperClass}>{action}</div>}
      </div>
    </div>
  );
}
