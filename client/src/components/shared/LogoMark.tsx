/**
 * Revive Home Buyers SVG logo mark — inline, scalable.
 * Extracted from Home.tsx for cross-page reuse (Nav, Footer, etc.).
 */
export default function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 48 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left peak */}
      <polyline points="2,40 16,6 24,22" stroke="white" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      {/* Right peak */}
      <polyline points="24,22 32,6 46,40" stroke="white" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      {/* Chimney on left peak */}
      <rect x="8" y="10" width="4" height="7" fill="white" />
      {/* 4-pane window */}
      <rect x="20" y="26" width="8" height="8" fill="#2D6A3F" />
      <line x1="24" y1="26" x2="24" y2="34" stroke="white" strokeWidth="1" />
      <line x1="20" y1="30" x2="28" y2="30" stroke="white" strokeWidth="1" />
    </svg>
  );
}
