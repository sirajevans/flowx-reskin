type IconProps = {
  className?: string;
};

const ICON_CLASS = 'size-3.5 shrink-0';

/** Module chrome: drag handle (6-dot grip) */
export function DragModuleIcon({ className = ICON_CLASS }: IconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[var(--widget-icon-dim)] ${className}`}
      aria-hidden
    >
      <circle cx="4.59257" cy="7.00001" r="1.16826" fill="currentColor" />
      <circle cx="9.40703" cy="7.00001" r="1.16826" fill="currentColor" />
      <circle cx="4.59257" cy="10.9932" r="1.16826" fill="currentColor" />
      <circle cx="9.40703" cy="10.9932" r="1.16826" fill="currentColor" />
      <circle cx="4.59257" cy="3.00685" r="1.16826" fill="currentColor" />
      <circle cx="9.40703" cy="3.00685" r="1.16826" fill="currentColor" />
    </svg>
  );
}

/** Module chrome: close widget */
export function CloseModuleIcon({ className = ICON_CLASS }: IconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[var(--widget-icon-dim)] ${className}`}
      aria-hidden
    >
      <path
        d="M2.99707 2.99692L11.0028 11.0026"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M11.0029 2.99741L2.99723 11.0031"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Module chrome: bottom-left resize handle */
export function ResizeHandleLeftIcon({ className = ICON_CLASS }: IconProps) {
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
      <path
        d="M0.520752 3.93103C0.520752 9.2043 4.79558 13.4791 10.0688 13.4791"
        stroke="white"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Module chrome: bottom-right resize handle */
export function ResizeHandleRightIcon({ className = ICON_CLASS }: IconProps) {
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
      <path
        d="M13.4792 3.93103C13.4792 9.2043 9.20442 13.4791 3.93115 13.4791"
        stroke="white"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
