type TerminalStatsDividerProps = {
  gradientId: string;
};

export function TerminalStatsDivider({ gradientId }: TerminalStatsDividerProps) {
  return (
    <svg
      aria-hidden
      width={1}
      height={35}
      viewBox="0 0 1 35"
      fill="none"
      className="h-[35px] w-px shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.25 0.25L0.250001 34.25"
        stroke={`url(#${gradientId})`}
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="0.75"
          y1="0.25"
          x2="0.750001"
          y2="34.25"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2B2B2B" stopOpacity={0} />
          <stop offset="0.5" stopColor="#2B2B2B" />
          <stop offset="1" stopColor="#2B2B2B" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
}
