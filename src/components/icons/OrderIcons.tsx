type IconProps = {
  className?: string;
};

const ICON_CLASS = 'size-3.5 shrink-0';

/** Order form: swap quote currency */
export function SwapCurrencyIcon({ className = ICON_CLASS }: IconProps) {
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
        d="M3.20059 11.116V5.41694C3.20059 4.22267 3.20059 3.62617 3.57166 3.2551C3.94273 2.88403 4.53923 2.88403 5.73349 2.88403M5.10027 9.5329L3.20059 11.116L1.30091 9.5329M10.7993 2.88403V8.58306C10.7993 9.77733 10.7993 10.3738 10.4282 10.7449C10.0572 11.116 9.46066 11.116 8.26703 11.116M8.89962 4.4671L10.7993 2.88403L12.699 4.4671"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Order form: risk toggle checkmark */
export function RiskCheckIcon({ className = '' }: IconProps) {
  return (
    <svg
      width="8"
      height="6"
      viewBox="0 0 8 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M2.75529 5.05737L0.5 2.80206M2.75326 5.05737L7.05418 0.500022"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Order form: expand/collapse risk management */
export function RiskManagementExpandIcon({ className = '' }: IconProps) {
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
        d="M6.99882 9.2449L12.1465 4.75472M7.00119 9.2449L1.85353 4.75472"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Order form: submit warning icon */
export function OrderWarningIcon({ className = '' }: IconProps) {
  return (
    <svg
      width="12"
      height="11"
      viewBox="0 0 12 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M12 11H6.09575H0L6.09575 0L12 11Z" fill="#E13240" />
      <path d="M6.75324 4.16187L6.75324 7.60175L5.44873 7.60175L5.44873 4.16187L6.75324 4.16187Z" fill="#161616" />
      <path d="M5.44873 9.88794L5.44873 8.69846L6.75324 8.69846L6.75324 9.88794L5.44873 9.88794Z" fill="#161616" />
    </svg>
  );
}
