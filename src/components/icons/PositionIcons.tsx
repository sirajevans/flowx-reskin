import { useId } from 'react';

type IconProps = {
  className?: string;
};

const ICON_CLASS = 'size-3.5 shrink-0';
const ENTRY_MARKET_ARROW_CLASS = 'shrink-0';

/** Entry price → market price separator */
export function EntryMarketArrowIcon({ className = ENTRY_MARKET_ARROW_CLASS }: IconProps) {
  return (
    <svg
      width="11"
      height="8"
      viewBox="0 0 11 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M9.20654 4.00112C9.20646 4.12653 9.15886 4.23957 9.08252 4.3273L9.0835 4.32827L9.06885 4.34487C9.06551 4.34838 9.06252 4.35221 9.05908 4.35562L6.42529 7.37515C6.24384 7.58317 5.92832 7.60529 5.72021 7.42398C5.51212 7.24246 5.49084 6.92602 5.67236 6.71792L7.60791 4.49917H2.29346C2.01735 4.49916 1.7935 4.27527 1.79346 3.99917C1.79347 3.72304 2.01733 3.49917 2.29346 3.49917H7.60693L5.67236 1.28237C5.4908 1.07432 5.51216 0.757887 5.72021 0.576319C5.92818 0.395069 6.24376 0.416453 6.42529 0.624171L9.0835 3.67105L9.20654 3.81167V4.00112Z"
        fill="white"
        fillOpacity="0.5"
      />
    </svg>
  );
}

/** Row action: edit position */
export function EditPositionIcon({ className = ICON_CLASS }: IconProps) {
  const clipId = useId();
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[var(--widget-icon-muted)] ${className}`}
      aria-hidden
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M9.29844 2.05336L7.29489 4.05697L2.73639 8.61544C2.17368 9.17814 1.8576 9.94136 1.8577 10.7371L1.8579 12.3395H3.46008C4.25574 12.3395 5.0188 12.0234 5.58141 11.4608L10.1401 6.90215L12.1437 4.89855C12.6674 4.37476 12.6674 3.52554 12.1437 3.00176L11.1953 2.05336C10.6715 1.52958 9.82226 1.52958 9.29844 2.05336Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Row action: move stop / TP to breakeven */
export function MoveToBreakevenIcon({ className = ICON_CLASS }: IconProps) {
  const clipId = useId();
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[var(--widget-icon-muted)] ${className}`}
      aria-hidden
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M12.9326 7H1.06714"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.50635 1.4635L7 3.96985L4.49365 1.4635"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.50635 12.5365L7 10.0302L4.49365 12.5365"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Row action: partial close (dashed frame) */
export function PartialCloseIcon({ className = ICON_CLASS }: IconProps) {
  const clipId = useId();
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[var(--widget-icon-muted)] ${className}`}
      aria-hidden
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M5.22803 5.22791L8.77208 8.77196"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8.77197 5.22812L5.22792 8.77217"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <rect
          x="1.46362"
          y="1.4635"
          width="11.072"
          height="11.072"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 2.5"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Row action: full close (solid frame, sell color) */
export function FullCloseIcon({ className = ICON_CLASS }: IconProps) {
  const clipId = useId();
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M5.22803 5.22791L8.77208 8.77196"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8.77197 5.22812L5.22792 8.77217"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <rect
          x="1.46362"
          y="1.4635"
          width="11.072"
          height="11.072"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
