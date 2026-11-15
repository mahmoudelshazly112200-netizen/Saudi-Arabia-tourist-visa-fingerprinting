import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost';
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
    'bg-[#161A8D] text-white hover:bg-[#10136B] active:bg-[#0C0E52] border border-transparent shadow-xs',
  secondary:
    'bg-[#C5E5FF] text-[#161A8D] hover:bg-[#b2dcff] active:bg-[#9dd1ff] border border-transparent',
  gold:
    'bg-[#C9A13B] text-[#0F172A] hover:bg-[#b8912f] active:bg-[#a37f25] border border-transparent font-bold',
  outline:
    'bg-white text-[#161A8D] border border-[#161A8D]/25 hover:border-[#161A8D] hover:bg-[#EEF7FF]',
  ghost:
    'bg-transparent text-slate-700 hover:text-[#161A8D] hover:bg-slate-100 border border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'min-h-[40px] px-4 py-2 text-sm rounded-lg gap-2',
  md: 'min-h-[46px] px-5 py-2.5 text-sm sm:text-base rounded-xl gap-2.5',
  lg: 'min-h-[52px] px-7 py-3.5 text-base rounded-xl gap-3',
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
    'inline-flex items-center justify-center font-semibold transition-colors duration-150',
    'whitespace-nowrap shrink-0 cursor-pointer select-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#161A8D]',
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
