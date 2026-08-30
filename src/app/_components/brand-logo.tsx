type BrandLogoProps = {
  compact?: boolean;
  className?: string;
};

export function BrandLogo({ compact = false, className }: BrandLogoProps) {
  return (
    <span className={className} data-compact={compact || undefined}>
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        width="34"
        height="34"
        focusable="false"
      >
        <defs>
          <linearGradient id="sp-public-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f2f5f7" />
            <stop offset="1" stopColor="#8f989f" />
          </linearGradient>
          <linearGradient id="sp-public-bolt" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d4ff57" />
            <stop offset="1" stopColor="#76b900" />
          </linearGradient>
          <filter id="sp-public-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>
        <path d="M17 19V7h7v12M40 19V7h7v12" stroke="url(#sp-public-metal)" strokeWidth="6" strokeLinecap="round" />
        <path d="M12 20h40v18c0 9-7 16-16 16h-8c-9 0-16-7-16-16V20Z" fill="url(#sp-public-metal)" />
        <path d="m43 3-25 31h12l-9 27 25-34H34Z" fill="#a9ff2e" opacity=".55" filter="url(#sp-public-glow)" />
        <path d="m43 3-25 31h12l-9 27 25-34H34Z" fill="url(#sp-public-bolt)" />
      </svg>
      {!compact && <strong>SPARK <em>PLUG</em></strong>}
    </span>
  );
}
