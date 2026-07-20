type SearchRankLogoProps = {
  className?: string;
};

/** A compact search lens and rising-rank mark for the app header. */
export default function SearchRankLogo({ className = '' }: SearchRankLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="AI Ranking Monitor"
      className={className}
    >
      <circle cx="13" cy="13" r="7" stroke="currentColor" strokeWidth="2.5" />
      <path d="m18.2 18.2 4.6 4.6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M9 15.5h2.5V12H14v-2.5h2.5v-2H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m16.8 7.5 2.2-2.2 2.2 2.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
