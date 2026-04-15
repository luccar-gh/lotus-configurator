/**
 * Custom thin-line SVG icons — No icon libraries (per CLAUDE.md NO list).
 * All icons: 20x20 viewBox, stroke-based, 1px weight.
 */

interface IconProps {
  size?: number;
  className?: string;
}

export function IconVoltage({ size = 20, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
      <path d="M11 1L5 11h5l-1 8 6-10h-5l1-8z" />
    </svg>
  );
}

export function IconCurrent({ size = 20, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
      <path d="M2 10h4l2-6 2 12 2-6h6" />
    </svg>
  );
}

export function IconFrequency({ size = 20, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
      <path d="M1 10c2 0 2-7 4-7s2 14 4 14 2-14 4-14 2 7 4 7" />
    </svg>
  );
}

export function IconChip({ size = 20, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
      <rect x="5" y="5" width="10" height="10" />
      <path d="M7 5V2M10 5V2M13 5V2M7 18v-3M10 18v-3M13 18v-3M5 7H2M5 10H2M5 13H2M18 7h-3M18 10h-3M18 13h-3" />
    </svg>
  );
}

export function IconThermal({ size = 20, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
      <path d="M10 2v10" />
      <circle cx="10" cy="15" r="3" />
      <path d="M8 12V6a2 2 0 114 0v6" />
    </svg>
  );
}

export function IconArea({ size = 20, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
      <rect x="3" y="3" width="14" height="14" strokeDasharray="2 2" />
      <path d="M3 3l4 4M17 3l-4 4M3 17l4-4M17 17l-4-4" />
    </svg>
  );
}

export function IconEfficiency({ size = 20, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
      <path d="M2 16l4-3 4-6 4-2 4-3" />
      <circle cx="10" cy="7" r="1.5" />
    </svg>
  );
}

export function IconCopilot({ size = 20, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
      <path d="M3 4h14M3 8h10M3 12h12M3 16h8" />
    </svg>
  );
}
