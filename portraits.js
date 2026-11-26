(function (global) {
  "use strict";

  const PORTRAITS = {
    clara: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="14" fill="#efe6d5"/>
      <path d="M16 74c2-15 12-22 24-22s22 7 24 22" fill="#9c5a4c"/>
      <path d="M21 44c0-15 8-26 19-26s19 11 19 26c0 6-3 12-7 14H28c-4-2-7-8-7-14z" fill="#c97b63"/>
      <circle cx="40" cy="39" r="13.5" fill="#f3cfb3"/>
      <path d="M28 36c3-7 21-7 24 0" stroke="#7a6d66" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="35" cy="39" r="1.7" fill="#2c2420"/>
      <circle cx="45" cy="39" r="1.7" fill="#2c2420"/>
      <path d="M35.5 45.5c2.5 2.4 6.5 2.4 9 0" stroke="#6b3e31" stroke-width="2" stroke-linecap="round"/>
      <circle cx="31.5" cy="43" r="2.2" fill="#e59d8d" opacity="0.55"/>
      <circle cx="48.5" cy="43" r="2.2" fill="#e59d8d" opacity="0.55"/>
    </svg>`,

    sam: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="14" fill="#e6ebe4"/>
      <path d="M15 75c2-15 11-23 25-23s23 8 25 23" fill="#3a4f41"/>
      <path d="M31 53h18v22H31z" fill="#f2efe8"/>
      <rect x="36" y="47" width="8" height="9" rx="3" fill="#e8be9e"/>
      <circle cx="40" cy="36" r="14" fill="#f0c7a8"/>
      <path d="M25 32c2-11 28-11 30 0-5-4-25-4-30 0z" fill="#352a24"/>
      <rect x="24" y="25" width="32" height="5" rx="2.5" fill="#2b3d32"/>
      <circle cx="35" cy="37" r="1.8" fill="#241c18"/>
      <circle cx="45" cy="37" r="1.8" fill="#241c18"/>
      <path d="M33 42.5c3.5 1.8 10.5 1.8 14 0" stroke="#3c2b23" stroke-width="2.6" stroke-linecap="round"/>
    </svg>`,

    pete: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="14" fill="#e5e8ee"/>
      <path d="M14 75c2-14 11-22 26-22s24 8 26 22" fill="#3b4c63"/>
      <path d="M36 53l4 10 4-10" fill="#c84b31"/>
      <circle cx="40" cy="37" r="13.5" fill="#f2cbb0"/>
      <path d="M26 33c1-11 10-16 18-15 6 1 11 5 10 15-4-6-21-6-28 0z" fill="#463529"/>
      <path d="M32 34l6 1.5M48 34l-6 1.5" stroke="#2c221c" stroke-width="2" stroke-linecap="round"/>
      <circle cx="35" cy="38.5" r="1.7" fill="#1e1b18"/>
      <circle cx="45" cy="38.5" r="1.7" fill="#1e1b18"/>
      <path d="M36 45h8" stroke="#5d3a2e" stroke-width="2" stroke-linecap="round"/>
      <path d="M58 22c2 3 2 6 0 8-2-2-2-5 0-8z" fill="#5da5d6"/>
    </svg>`,

    ken: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="14" fill="#ebe5d8"/>
      <path d="M14 75c2-15 11-23 26-23s24 8 26 23" fill="#5e5242"/>
      <rect x="33" y="52" width="14" height="23" fill="#d9d1c3"/>
      <circle cx="40" cy="38" r="14" fill="#e8ba98"/>
      <path d="M22 29c4-11 32-11 36 0H22z" fill="#3e3932"/>
      <path d="M20 29h40v4H20z" fill="#2c2823"/>
      <circle cx="35" cy="38" r="1.8" fill="#1f1a17"/>
      <circle cx="45" cy="38" r="1.8" fill="#1f1a17"/>
      <path d="M32 44c3-2 13-2 16 0" stroke="#47382e" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    shade: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="14" fill="#1b2028"/>
      <path d="M12 76c3-17 12-26 28-26s25 9 28 26" fill="#111419"/>
      <path d="M24 52l16 14 16-14-4-7H28l-4 7z" fill="#242a34"/>
      <circle cx="40" cy="38" r="13" fill="#c9b4a2"/>
      <path d="M18 28h44v4H18z" fill="#0d0f13"/>
      <path d="M25 28l4-13h22l4 13H25z" fill="#151921"/>
      <rect x="27" y="25" width="26" height="3" fill="#8b3f31"/>
      <rect x="29" y="34" width="10" height="6" rx="2" fill="#0e1116" stroke="#d4a76a" stroke-width="1.2"/>
      <rect x="41" y="34" width="10" height="6" rx="2" fill="#0e1116" stroke="#d4a76a" stroke-width="1.2"/>
      <path d="M31 36l3 2M43 36l3 2" stroke="#f5e1b9" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M36 46h8" stroke="#362c27" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,

    enforcer: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="14" fill="#211818"/>
      <path d="M10 76c2-17 12-26 30-26s28 9 30 26" fill="#191616"/>
      <path d="M35 51h10l-3 18h-4l-3-18z" fill="#8f2d21"/>
      <rect x="26" y="24" width="28" height="27" rx="9" fill="#d9ad8c"/>
      <path d="M26 30c0-6 5-9 14-9s14 3 14 9v-2H26v2z" fill="#231c19"/>
      <rect x="28" y="33" width="11" height="6" rx="1.5" fill="#111"/>
      <rect x="41" y="33" width="11" height="6" rx="1.5" fill="#111"/>
      <line x1="39" y1="36" x2="41" y2="36" stroke="#111" stroke-width="2"/>
      <path d="M34 45h12" stroke="#422a22" stroke-width="2.4" stroke-linecap="round"/>
    </svg>`,

    don: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="14" fill="#261917"/>
      <path d="M12 76c3-16 13-25 28-25s25 9 28 25" fill="#1d1c21"/>
      <path d="M32 52l8 16 8-16" fill="#ece6db"/>
      <path d="M38 54h4l1 13h-6l1-13z" fill="#a63124"/>
      <circle cx="40" cy="36" r="14" fill="#e5b898"/>
      <path d="M26 33c1-12 27-12 28 0-4-6-24-6-28 0z" fill="#383436"/>
      <path d="M26 31c4-4 24-4 28 0" stroke="#757074" stroke-width="1.6"/>
      <path d="M31 34l7 2M49 34l-7 2" stroke="#261f1c" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="35" cy="38" r="1.7" fill="#171311"/>
      <circle cx="45" cy="38" r="1.7" fill="#171311"/>
      <path d="M33 43.5c3.5-1.5 10.5-1.5 14 0" stroke="#383436" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="62" cy="61" r="7" fill="#d4a76a" stroke="#f5dfa9" stroke-width="1.4"/>
      <text x="62" y="64" text-anchor="middle" font-size="8" font-weight="800" fill="#4f3310">1</text>
    </svg>`,

    don_cern: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="14" fill="#142329"/>
      <path d="M12 76c3-16 13-25 28-25s25 9 28 25" fill="#dce4e8"/>
      <path d="M33 52l7 16 7-16" fill="#23323a"/>
      <circle cx="40" cy="36" r="14" fill="#e5b898"/>
      <path d="M26 33c1-12 27-12 28 0-4-6-24-6-28 0z" fill="#4f5458"/>
      <circle cx="35" cy="38" r="1.7" fill="#171311"/>
      <circle cx="45" cy="38" r="1.7" fill="#171311"/>
      <path d="M33 44c3.5-1.5 10.5-1.5 14 0" stroke="#4f5458" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="57" cy="63" r="8" stroke="#38bdf8" stroke-width="1.5"/>
      <ellipse cx="57" cy="63" rx="8" ry="3.2" transform="rotate(35 57 63)" stroke="#38bdf8" stroke-width="1.3"/>
      <ellipse cx="57" cy="63" rx="8" ry="3.2" transform="rotate(-35 57 63)" stroke="#38bdf8" stroke-width="1.3"/>
      <circle cx="57" cy="63" r="1.8" fill="#f59e0b"/>
    </svg>`,

    elena: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="14" fill="#16222c"/>
      <path d="M14 76c2-15 12-23 26-23s24 8 26 23" fill="#e4ecf0"/>
      <path d="M33 53l7 14 7-14" fill="#2a485e"/>
      <path d="M23 42c0-16 7-25 17-25s17 9 17 25v10H23V42z" fill="#3a2a24"/>
      <circle cx="40" cy="38" r="13" fill="#f4cfb6"/>
      <rect x="29" y="34" width="9.5" height="6.5" rx="2.5" stroke="#243847" stroke-width="1.8" fill="rgba(56,189,248,0.12)"/>
      <rect x="41.5" y="34" width="9.5" height="6.5" rx="2.5" stroke="#243847" stroke-width="1.8" fill="rgba(56,189,248,0.12)"/>
      <line x1="38.5" y1="37" x2="41.5" y2="37" stroke="#243847" stroke-width="1.6"/>
      <circle cx="34" cy="37.5" r="1.4" fill="#1d242b"/>
      <circle cx="46" cy="37.5" r="1.4" fill="#1d242b"/>
      <path d="M36 45.5c2.2 1.2 5.8 1.2 8 0" stroke="#7d4a3d" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,

    master: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="14" fill="#1f1c18"/>
      <circle cx="40" cy="38" r="32" fill="url(#mglow)" opacity="0.45"/>
      <defs>
        <radialGradient id="mglow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stop-color="#d4a76a"/>
          <stop offset="100%" stop-color="#1f1c18" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <path d="M14 76c3-16 13-24 26-24s23 8 26 24" fill="#362f28"/>
      <path d="M32 52l8 12 8-12" fill="#d4a76a" opacity="0.85"/>
      <circle cx="40" cy="37" r="14" fill="#ecc09e"/>
      <path d="M21 28c4-11 34-11 38 0H21z" fill="#4c4338"/>
      <path d="M19 28h42v3.5H19z" fill="#2e2822"/>
      <circle cx="34" cy="37" r="4.8" stroke="#d4a76a" stroke-width="1.7" fill="rgba(255,255,255,0.12)"/>
      <circle cx="46" cy="37" r="4.8" stroke="#d4a76a" stroke-width="1.7" fill="rgba(255,255,255,0.12)"/>
      <line x1="38.8" y1="37" x2="41.2" y2="37" stroke="#d4a76a" stroke-width="1.6"/>
      <circle cx="34" cy="37" r="1.5" fill="#1c1613"/>
      <circle cx="46" cy="37" r="1.5" fill="#1c1613"/>
      <path d="M30 44c3.5-2.6 16.5-2.6 20 0-3 3.5-17 3.5-20 0z" fill="#e8e3da"/>
    </svg>`,

    master_future: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="14" fill="#0d1117"/>
      <circle cx="40" cy="40" r="33" stroke="#d4a76a" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.65"/>
      <circle cx="40" cy="40" r="24" stroke="#38bdf8" stroke-width="1" opacity="0.45"/>
      <path d="M16 76c3-15 12-23 24-23s21 8 24 23" fill="#262d36"/>
      <circle cx="40" cy="37" r="14" fill="#ecc09e"/>
      <path d="M26 32c1-12 27-12 28 0-4-5-24-5-28 0z" fill="#e2e8f0"/>
      <circle cx="34" cy="37" r="4.8" stroke="#38bdf8" stroke-width="1.7" fill="rgba(56,189,248,0.18)"/>
      <circle cx="46" cy="37" r="4.8" stroke="#38bdf8" stroke-width="1.7" fill="rgba(56,189,248,0.18)"/>
      <line x1="38.8" y1="37" x2="41.2" y2="37" stroke="#38bdf8" stroke-width="1.6"/>
      <circle cx="34" cy="37" r="1.5" fill="#0f172a"/>
      <circle cx="46" cy="37" r="1.5" fill="#0f172a"/>
      <path d="M30 44c3.5-2.6 16.5-2.6 20 0-3 3.2-17 3.2-20 0z" fill="#e8eef4"/>
    </svg>`,

    void: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="14" fill="#080a0f"/>
      <circle cx="40" cy="40" r="27" stroke="#d4a76a" stroke-width="1.8" opacity="0.7"/>
      <ellipse cx="40" cy="40" rx="34" ry="11" transform="rotate(-20 40 40)" stroke="#f59e0b" stroke-width="2" opacity="0.85"/>
      <ellipse cx="40" cy="40" rx="31" ry="8" transform="rotate(-20 40 40)" stroke="#38bdf8" stroke-width="1.2" opacity="0.65"/>
      <circle cx="40" cy="40" r="15" fill="#020305" stroke="#fde68a" stroke-width="1.2"/>
      <circle cx="17" cy="18" r="1.5" fill="#fff"/>
      <circle cx="64" cy="21" r="1.2" fill="#38bdf8"/>
      <circle cx="61" cy="64" r="1.6" fill="#fde68a"/>
      <circle cx="18" cy="61" r="1.2" fill="#fff"/>
    </svg>`,
  };

  function getPortrait(id) {
    return PORTRAITS[id] || PORTRAITS.shade;
  }

  const api = { getPortrait, PORTRAITS };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.EsnafPortraits = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
