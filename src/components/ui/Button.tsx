import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'white' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

type ActionButtonProps = BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
    to?: undefined;
    href?: undefined;
  };

type RouterLinkButtonProps = BaseButtonProps & {
  to: string;
  href?: undefined;
  onClick?: () => void;
};

type ExternalLinkButtonProps = BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & {
    href: string;
    to?: undefined;
  };

export type ButtonProps = ActionButtonProps | RouterLinkButtonProps | ExternalLinkButtonProps;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#171C91] text-white hover:bg-[#10145F] active:bg-[#0C104D] border border-transparent shadow-xs',
  secondary:
    'bg-[#EAF4FF] text-[#004AAD] hover:bg-[#C5E5FF] active:bg-[#97C2FA]/40 border border-[#C5E5FF]',
  white:
    'bg-white text-[#171C91] hover:bg-[#C5E5FF] active:bg-[#DDE8FF] border border-transparent font-bold shadow-xs',
  outline:
    'bg-white text-[#004AAD] border border-[#E6ECF4] hover:border-[#004AAD] hover:bg-[#F3F7FC]',
  ghost:
    'bg-transparent text-[#17213B] hover:text-[#004AAD] hover:bg-[#F3F7FC] border border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'min-h-[42px] px-4 py-2 text-[length:var(--text-btn)] font-bold rounded-lg gap-2',
  md: 'min-h-[48px] px-5 py-2.5 text-[length:var(--text-btn)] font-bold rounded-xl gap-2.5',
  lg: 'min-h-[52px] px-7 py-3.5 text-[length:var(--text-btn)] font-bold rounded-xl gap-3',
};

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    children,
    className = '',
  } = props;

  const baseClass = [
    'inline-flex items-center justify-center font-bold transition-colors duration-150',
    'whitespace-nowrap shrink-0 cursor-pointer select-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171C91]',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if ('to' in props && props.to !== undefined) {
    return (
      <Link to={props.to} onClick={props.onClick} className={baseClass}>
        {children}
      </Link>
    );
  }

  if ('href' in props && props.href !== undefined) {
    const {
      href,
      variant: _v,
      size: _s,
      fullWidth: _fw,
      isLoading: _il,
      children: _c,
      className: _cn,
      ...anchorRest
    } = props;
    return (
      <a href={href} className={baseClass} {...anchorRest}>
        {children}
      </a>
    );
  }

  const {
    variant: _v,
    size: _s,
    fullWidth: _fw,
    isLoading: _il,
    children: _c,
    className: _cn,
    disabled,
    type = 'button',
    ...buttonRest
  } = props;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={baseClass}
      {...buttonRest}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />}
      {children}
    </button>
  );
}
