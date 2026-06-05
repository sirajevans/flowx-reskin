import { useId } from 'react';
import { commandInputDividerClass, commandInputDividerWrapperClass } from './commandClasses';

export function CommandInputDivider() {
  const gradientId = useId();

  return (
    <div className={commandInputDividerWrapperClass}>
      <svg
      width="488"
      height="1"
      viewBox="0 0 488 1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={commandInputDividerClass}
      aria-hidden
    >
      <path
        d="M0 0.5L488 0.500043"
        stroke={`url(#${gradientId})`}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="-4.37114e-08"
          y1="1"
          x2="488"
          y2="1.00004"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2B2B2B" stopOpacity="0" />
          <stop offset="0.5" stopColor="#2B2B2B" />
          <stop offset="1" stopColor="#2B2B2B" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
    </div>
  );
}
