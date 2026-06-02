import type { ReactNode } from 'react';

export type IconButtonProps = {
  label: string;
  onPress?: () => void;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  tone?: 'muted' | 'danger';
};

export function IconButton({
  label,
  onPress,
  onClick,
  children,
  className = '',
  tone = 'muted',
}: IconButtonProps) {
  const toneClass =
    tone === 'danger'
      ? 'text-sell [@media(hover:hover)]:hover:text-[color-mix(in_srgb,var(--color-sell)_78%,white)]'
      : 'text-[var(--widget-icon-muted)] [@media(hover:hover)]:hover:text-[var(--flowx-muted)]';

  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        (onPress ?? onClick)?.();
      }}
      className={`inline-flex size-3.5 shrink-0 items-center justify-center rounded-sm transition-colors duration-150 ease motion-reduce:transition-none [&_svg]:text-inherit ${toneClass} ${className}`}
    >
      {children}
    </button>
  );
}
