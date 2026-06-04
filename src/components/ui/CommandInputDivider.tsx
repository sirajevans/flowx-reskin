import { commandInputDividerClass } from './commandClasses';

const GRADIENT_ID = 'command-menu-divider-gradient';

export function CommandInputDivider() {
  return (
    <svg
      viewBox="0 0 488 1"
      preserveAspectRatio="none"
      width="488"
      height="1"
      xmlns="http://www.w3.org/2000/svg"
      className={commandInputDividerClass}
      aria-hidden
    >
      <defs>
        <linearGradient id={GRADIENT_ID} gradientUnits="objectBoundingBox" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0" stopColor="rgba(43, 43, 43, 0)" />
          <stop offset="0.1" stopColor="#2b2b2b" />
          <stop offset="0.9" stopColor="#2b2b2b" />
          <stop offset="1" stopColor="rgba(43, 43, 43, 0)" />
        </linearGradient>
      </defs>
      <path
        d="M0 0H488"
        vectorEffect="non-scaling-stroke"
        fill="none"
        stroke={`url(#${GRADIENT_ID})`}
        strokeLinecap="round"
      />
    </svg>
  );
}
