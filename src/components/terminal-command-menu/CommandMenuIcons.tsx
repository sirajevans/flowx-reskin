import { cn } from '../../lib/utils';
import type { TerminalCommandItem } from './terminalCommands';
import { commandItemIconClass } from '../ui/commandClasses';

const STROKE = '#808080';

type CommandMenuStarIconProps = {
  filled?: boolean;
  className?: string;
};

export function CommandMenuStarIcon({ filled = false, className }: CommandMenuStarIconProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      width="14"
      height="14"
      className={cn('size-3.5 shrink-0', className)}
      aria-hidden
    >
      <path
        d="M7 1.75L8.472 5.528L12.25 5.611L9.375 8.361L10.278 12.111L7 10.278L3.722 12.111L4.625 8.361L1.75 5.611L5.528 5.528L7 1.75Z"
        fill={filled ? STROKE : 'none'}
        stroke={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type IconProps = {
  icon: TerminalCommandItem['icon'];
};

export function CommandMenuIcon({ icon }: IconProps) {
  return (
    <span className={commandItemIconClass} aria-hidden>
      {icon === 'positions' ? (
        <svg viewBox="0 0 14 14" width="14" height="14" className="absolute left-0 top-0 size-3.5">
          <path
            d="M7.00002 5.61029L4.27312 2.8834L1.54623 5.61029"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.26758 3.30029L4.26758 11.1166"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.00002 8.38965L9.72691 11.1165L12.4538 8.38965"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.73245 10.6996L9.73245 2.88335"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {icon === 'trade-panel' ? (
        <svg viewBox="0 0 14 14" width="14" height="14" className="absolute left-0 top-0 size-3.5">
          <path
            d="M5.38135 5.37108C5.37453 5.28147 5.37106 5.19094 5.37106 5.09959C5.37106 3.15039 6.95117 1.57025 8.9004 1.57025C10.8496 1.57025 12.4297 3.15039 12.4297 5.09959C12.4297 7.04881 10.8496 8.62892 8.9004 8.62892C8.80907 8.62892 8.7185 8.62545 8.62891 8.61866"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.09959 12.4298C3.15039 12.4298 1.57025 10.8497 1.57025 8.90043C1.57025 6.9512 3.15039 5.37109 5.09959 5.37109C7.04881 5.37109 8.62892 6.9512 8.62892 8.90043C8.62892 10.8497 7.04881 12.4298 5.09959 12.4298Z"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {icon === 'order-feed' ? (
        <svg viewBox="0 0 14 14" width="14" height="14" className="absolute left-0 top-0 size-3.5">
          <path
            d="M11.9977 8.15005V3.96946C11.9977 3.10363 11.2958 2.40173 10.43 2.40173H5.20426C4.33843 2.40173 3.63654 3.10363 3.63654 3.96946V7.62747"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.90742 11.8081H3.63653C2.48209 11.8081 1.54623 10.8722 1.54623 9.7178C1.54623 8.56338 2.48209 7.6275 3.63653 7.6275H9.38484H9.90742C8.753 7.6275 7.81712 8.56338 7.81712 9.7178C7.81712 10.8722 8.753 11.8081 9.90742 11.8081ZM9.90742 11.8081C11.0618 11.8081 11.9977 10.8722 11.9977 9.7178V8.15008"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {icon === 'liquidations' ? (
        <svg viewBox="0 0 14 14" width="14" height="14" className="absolute left-0 top-0 size-3.5">
          <path
            d="M1.54623 5.28225L7 1.50317L12.4538 5.28225"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.75818 12.4968H11.2418"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.78806 4.93866H8.21195"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.36417 10.4355V7"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.78806 10.4355V7"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.21194 10.4355V7"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.6358 10.4355V7"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {icon === 'money-flow' ? (
        <svg viewBox="0 0 14 14" width="14" height="14" className="absolute left-0 top-0 size-3.5">
          <path
            d="M1.54623 6.99997H3.36416L5.18208 1.5462L8.81792 12.4537L10.6358 6.99997H12.4538"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {icon === 'funding-rates' ? (
        <svg viewBox="0 0 14 14" width="14" height="14" className="absolute left-0 top-0 size-3.5">
          <path
            d="M1.54623 11.2717H12.4538"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.54623 8.34592L4.20124 6.71252L6.33584 7.31509L9.29188 3.69556L12.4538 5.11219"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.54623 3.01453L3.12344 4.15155L5.11429 2.72839L7.17557 4.52763L9.0647 2.72839L10.8074 4.15155L12.4538 3.01453"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
        </svg>
      ) : null}
      {icon === 'chart' ? (
        <svg viewBox="0 0 14 14" width="14" height="14" className="absolute left-0 top-0 size-3.5">
          <path
            d="M12.4538 12.4538H1.54623V1.54623"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.54623 10.0677L7 4.95483L9.04516 6.99999L12.1129 3.93225"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {icon === 'chat' ? (
        <svg viewBox="0 0 14 14" width="14" height="14" className="absolute left-0 top-0 size-3.5">
          <path
            d="M11.9977 6.99997C11.9977 9.45107 9.45107 11.9977 6.99997 11.9977C6.22097 11.9977 5.48107 11.8081 4.82812 11.4707L1.54623 12.4537L2.5293 9.17178C2.19189 8.51883 2.00223 7.77893 2.00223 6.99997C2.00223 4.54887 4.54887 2.00223 6.99997 2.00223C9.45107 2.00223 11.9977 4.54887 11.9977 6.99997Z"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {icon === 'reset' ? (
        <svg viewBox="0 0 14 14" width="14" height="14" className="absolute left-0 top-0 size-3.5">
          <path
            d="M1.67422 5.93477C1.67422 5.93477 7.53258 5.93477 9.13031 5.93477C13.3909 5.93477 13.3909 11.7931 9.13031 11.7931M5.40227 9.66281L1.67422 5.93477L5.40227 2.20673"
            fill="none"
            stroke={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  );
}
