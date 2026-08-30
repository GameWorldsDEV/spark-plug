/**
 * Original public renditions of Spark Plug's physical-media language:
 * a model profile as a game cartridge, a model load as a burned disc.
 * Drawn fresh for this repository — no private dashboard source.
 *
 * The cartridge mapping (one part per setting):
 *   chip = the model · battery = the context window · contacts = the tools
 *   lens = vision (an empty socket when the model cannot see)
 */

export function CartridgeArt() {
  return (
    <svg
      viewBox="0 0 240 306"
      role="img"
      aria-label="A game cartridge representing a Spark Plug model profile: a labeled shell with a model chip, context battery, vision lens socket, and gold tool contacts"
    >
      {/* shell */}
      <rect x="16" y="10" width="208" height="252" rx="18" fill="#1b2126" />
      <rect
        x="16"
        y="10"
        width="208"
        height="252"
        rx="18"
        fill="none"
        stroke="rgba(255,255,255,0.14)"
      />
      {/* grip ridges */}
      <g fill="rgba(255,255,255,0.1)">
        <rect x="38" y="24" width="102" height="4" rx="2" />
        <rect x="38" y="33" width="102" height="4" rx="2" />
        <rect x="38" y="42" width="102" height="4" rx="2" />
      </g>
      {/* corner screws */}
      <g fill="#0e1114" stroke="rgba(255,255,255,0.2)">
        <circle cx="34" cy="240" r="6" />
        <circle cx="206" cy="240" r="6" />
      </g>
      <g stroke="rgba(255,255,255,0.28)" strokeWidth="1.4">
        <path d="M30 240h8M206 236v8" />
      </g>
      {/* label plate */}
      <rect x="36" y="58" width="168" height="112" rx="9" fill="#101720" />
      <rect
        x="36"
        y="58"
        width="168"
        height="112"
        rx="9"
        fill="none"
        stroke="rgba(120,170,255,0.22)"
      />
      {/* crest */}
      <polygon
        points="66,76 84,86 84,106 66,116 48,106 48,86"
        fill="#2f6fd6"
      />
      <polygon
        points="66,76 84,86 84,106 66,116 48,106 48,86"
        fill="none"
        stroke="rgba(200,225,255,0.5)"
      />
      <text
        x="66"
        y="101"
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="14"
        fontWeight="700"
        fill="#eaf3ff"
      >
        SP
      </text>
      {/* label stripes */}
      <g fill="#3f7fe0">
        <rect x="98" y="80" width="88" height="7" rx="3.5" />
        <rect x="98" y="93" width="70" height="7" rx="3.5" opacity="0.75" />
        <rect x="98" y="106" width="80" height="7" rx="3.5" opacity="0.5" />
      </g>
      <text
        x="48"
        y="146"
        fontFamily="var(--mono)"
        fontSize="11"
        letterSpacing="1.5"
        fill="rgba(233,240,246,0.85)"
      >
        CODER-DAILY
      </text>
      <text
        x="48"
        y="160"
        fontFamily="var(--mono)"
        fontSize="8"
        letterSpacing="1.2"
        fill="rgba(233,240,246,0.45)"
      >
        SPARK PLUG PROFILE
      </text>
      {/* model chip */}
      <rect x="40" y="186" width="58" height="30" rx="4" fill="#0d1013" />
      <rect
        x="40"
        y="186"
        width="58"
        height="30"
        rx="4"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
      />
      <text
        x="69"
        y="205"
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="9"
        letterSpacing="1"
        fill="#a9ff2e"
      >
        MODEL
      </text>
      {/* context battery */}
      <rect x="108" y="188" width="46" height="26" rx="13" fill="#0d1013" />
      <rect
        x="108"
        y="188"
        width="46"
        height="26"
        rx="13"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
      />
      <text
        x="131"
        y="205"
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="9"
        letterSpacing="0.5"
        fill="#ffd66e"
      >
        131K
      </text>
      {/* vision lens: an empty socket — the honest state */}
      <circle
        cx="184"
        cy="201"
        r="13"
        fill="none"
        stroke="rgba(255,255,255,0.28)"
        strokeDasharray="4 4"
      />
      <text
        x="184"
        y="228"
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="7"
        letterSpacing="1"
        fill="rgba(233,240,246,0.4)"
      >
        NO LENS
      </text>
      {/* tool contacts */}
      <rect x="62" y="262" width="116" height="34" rx="6" fill="#0d1013" />
      <g fill="#d9a94e">
        <rect x="72" y="270" width="8" height="18" rx="1.5" />
        <rect x="85" y="270" width="8" height="18" rx="1.5" />
        <rect x="98" y="270" width="8" height="18" rx="1.5" />
        <rect x="111" y="270" width="8" height="18" rx="1.5" />
        <rect x="124" y="270" width="8" height="18" rx="1.5" />
        <rect x="137" y="270" width="8" height="18" rx="1.5" />
        <rect x="150" y="270" width="8" height="18" rx="1.5" />
        <rect x="163" y="270" width="8" height="18" rx="1.5" />
      </g>
    </svg>
  );
}

export function DiscArt() {
  return (
    <svg
      viewBox="0 0 260 260"
      role="img"
      aria-label="A burned disc representing a loaded model: a data ring around a hub labeled with the model size"
    >
      {/* platter */}
      <circle cx="130" cy="130" r="118" fill="#171c21" />
      <circle
        cx="130"
        cy="130"
        r="118"
        fill="none"
        stroke="rgba(255,255,255,0.16)"
      />
      {/* iridescent wedges */}
      <g opacity="0.5">
        <path d="M130 130 L130 14 A116 116 0 0 1 218 60 Z" fill="rgba(63,127,224,0.18)" />
        <path d="M130 130 L218 60 A116 116 0 0 1 246 130 Z" fill="rgba(169,255,46,0.12)" />
        <path d="M130 130 L58 221 A116 116 0 0 1 16 108 Z" fill="rgba(255,214,110,0.1)" />
        <path d="M130 130 L16 108 A116 116 0 0 1 68 34 Z" fill="rgba(120,235,255,0.1)" />
      </g>
      {/* burned data tracks */}
      <g fill="none" stroke="rgba(169,255,46,0.5)">
        <circle cx="130" cy="130" r="98" strokeWidth="3" strokeDasharray="250 900" />
        <circle cx="130" cy="130" r="88" strokeWidth="3" strokeDasharray="180 700" strokeDashoffset="120" />
        <circle cx="130" cy="130" r="78" strokeWidth="3" strokeDasharray="140 560" strokeDashoffset="260" />
      </g>
      <g fill="none" stroke="rgba(255,255,255,0.1)">
        <circle cx="130" cy="130" r="108" />
        <circle cx="130" cy="130" r="60" />
      </g>
      {/* hub */}
      <circle cx="130" cy="130" r="46" fill="#0d1013" />
      <circle
        cx="130"
        cy="130"
        r="46"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
      />
      <circle cx="130" cy="130" r="10" fill="#04060a" />
      <circle
        cx="130"
        cy="130"
        r="10"
        fill="none"
        stroke="rgba(255,255,255,0.24)"
      />
      <text
        x="130"
        y="112"
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="13"
        fontWeight="700"
        fill="#f5f7f2"
      >
        CD
      </text>
      <text
        x="130"
        y="158"
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="10"
        letterSpacing="1"
        fill="rgba(233,240,246,0.6)"
      >
        19.8 GB
      </text>
    </svg>
  );
}
