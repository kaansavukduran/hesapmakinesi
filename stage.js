(function (global) {
  "use strict";

  const BG_MAP = {
    "shop-day": "./assets/bg_shop_day.webp",
    "shop-storm": "./assets/bg_shop_storm.webp",
    "mafia-basement": "./assets/bg_mafia_basement.webp",
    "syndicate-vault": "./assets/bg_syndicate_vault.webp",
    "cern-lab": "./assets/bg_cern_lab.webp",
    "spacetime-rift": "./assets/bg_spacetime_rift.webp",
    "master-dojo": "./assets/bg_master_dojo.webp",
  };

  /* =========================================================
     MULTI-LAYERED ANIMATED WAIST-UP CHARACTER RIGS (SVG)
     ========================================================= */
  function getCharacterRig(id) {
    const rigs = {
      clara: `
        <svg class="char-svg" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g class="rig-body">
            <path d="M36 200c4-42 22-62 54-62s50 20 54 62H36z" fill="#9c5a4c" stroke="#2c1d19" stroke-width="3"/>
            <path d="M58 140c10 14 54 14 64 0l12 60H46l12-60z" fill="#b86b58"/>
            <path d="M76 138h28l-6 26H82l-6-26z" fill="#f3ead9" stroke="#2c1d19" stroke-width="2"/>
            <g class="rig-head">
              <path d="M48 92c0-34 18-56 42-56s42 22 42 56c0 18-8 34-18 42H66c-10-8-18-24-18-42z" fill="#c97b63" stroke="#2c1d19" stroke-width="3"/>
              <ellipse cx="90" cy="86" rx="28" ry="30" fill="#f5d2b6" stroke="#2c1d19" stroke-width="2.6"/>
              <path d="M64 76c8-15 44-15 52 0" stroke="#7d6e66" stroke-width="4" stroke-linecap="round"/>
              <g class="rig-brows">
                <path class="brow-l" d="M72 78c4-3 9-3 12 0" stroke="#4a3830" stroke-width="2.4" stroke-linecap="round"/>
                <path class="brow-r" d="M96 78c4-3 9-3 12 0" stroke="#4a3830" stroke-width="2.4" stroke-linecap="round"/>
              </g>
              <g class="rig-eyes">
                <circle cx="78" cy="86" r="3.4" fill="#231b18"/>
                <circle cx="102" cy="86" r="3.4" fill="#231b18"/>
                <circle cx="79.2" cy="84.8" r="1.1" fill="#fff"/>
                <circle cx="103.2" cy="84.8" r="1.1" fill="#fff"/>
              </g>
              <circle cx="69" cy="94" r="4.5" fill="#e59785" opacity="0.5"/>
              <circle cx="111" cy="94" r="4.5" fill="#e59785" opacity="0.5"/>
              <g class="rig-mouth">
                <path class="mouth-calm" d="M81 101c4 5 14 5 18 0" stroke="#6b3b2e" stroke-width="2.6" stroke-linecap="round"/>
                <ellipse class="mouth-talk" cx="90" cy="102" rx="5.5" ry="4" fill="#7a342a"/>
              </g>
            </g>
          </g>
        </svg>`,

      sam: `
        <svg class="char-svg" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g class="rig-body">
            <path d="M30 200c6-42 26-62 60-62s54 20 60 62H30z" fill="#3a4f41" stroke="#1b261f" stroke-width="3"/>
            <path d="M62 138h56v62H62z" fill="#efeae0" stroke="#1b261f" stroke-width="2.4"/>
            <path d="M68 138v22M112 138v22" stroke="#28382d" stroke-width="4"/>
            <rect x="80" y="114" width="20" height="26" rx="8" fill="#e8bd9c" stroke="#2c1d19" stroke-width="2.4"/>
            <g class="rig-head">
              <ellipse cx="90" cy="84" rx="29" ry="31" fill="#f0c7a8" stroke="#2c1d19" stroke-width="2.8"/>
              <path d="M60 72c4-22 56-22 60 0-12-8-48-8-60 0z" fill="#332620"/>
              <path d="M54 58h72v10H54z" fill="#293b30" stroke="#17221b" stroke-width="2.4"/>
              <path d="M64 58c4-16 48-16 52 0H64z" fill="#3a4f41" stroke="#17221b" stroke-width="2.4"/>
              <g class="rig-brows">
                <path class="brow-l" d="M71 76h14" stroke="#2c1f1a" stroke-width="3" stroke-linecap="round"/>
                <path class="brow-r" d="M95 76h14" stroke="#2c1f1a" stroke-width="3" stroke-linecap="round"/>
              </g>
              <g class="rig-eyes">
                <circle cx="78" cy="84" r="3.5" fill="#1e1714"/>
                <circle cx="102" cy="84" r="3.5" fill="#1e1714"/>
                <circle cx="79" cy="82.8" r="1.1" fill="#fff"/>
                <circle cx="103" cy="82.8" r="1.1" fill="#fff"/>
              </g>
              <path d="M74 96c8 4 24 4 32 0" stroke="#3c2b23" stroke-width="5.5" stroke-linecap="round"/>
              <g class="rig-mouth">
                <path class="mouth-calm" d="M82 103c4 3 12 3 16 0" stroke="#5c3528" stroke-width="2.4" stroke-linecap="round"/>
                <ellipse class="mouth-talk" cx="90" cy="103" rx="5.5" ry="3.6" fill="#6b2e26"/>
              </g>
            </g>
          </g>
        </svg>`,

      pete: `
        <svg class="char-svg" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g class="rig-body">
            <path d="M32 200c5-40 24-60 58-60s53 20 58 60H32z" fill="#3a4e68" stroke="#1b2430" stroke-width="3"/>
            <path d="M78 140l12 34 12-34H78z" fill="#f4f1ea"/>
            <path d="M86 142h8l3 28-7 10-7-10 3-28z" fill="#c84b31"/>
            <rect x="79" y="109" width="22" height="34" rx="9" fill="#e6bc9f" stroke="#2b1e1a" stroke-width="2.4"/>
            <g class="rig-head">
              <ellipse cx="90" cy="84" rx="28" ry="30" fill="#f3cbb0" stroke="#2b1e1a" stroke-width="2.8"/>
              <path d="M62 74c3-24 26-30 40-26 12 3 20 12 18 26-8-10-42-10-58 0z" fill="#463428" stroke="#2b1e1a" stroke-width="2.2"/>
              <g class="rig-brows">
                <path class="brow-l" d="M70 74l14 4" stroke="#2c201a" stroke-width="2.8" stroke-linecap="round"/>
                <path class="brow-r" d="M110 74l-14 4" stroke="#2c201a" stroke-width="2.8" stroke-linecap="round"/>
              </g>
              <g class="rig-eyes">
                <circle cx="78" cy="85" r="3.4" fill="#1e1916"/>
                <circle cx="102" cy="85" r="3.4" fill="#1e1916"/>
              </g>
              <g class="rig-mouth">
                <path class="mouth-calm" d="M82 101h16" stroke="#5e3a2d" stroke-width="2.8" stroke-linecap="round"/>
                <ellipse class="mouth-talk" cx="90" cy="101" rx="6" ry="4.5" fill="#75332a"/>
              </g>
              <path class="sweat-drop" d="M126 62c5 7 5 13 0 16-5-3-5-9 0-16z" fill="#5fb6ea" stroke="#1d4d6b" stroke-width="1.5"/>
            </g>
            <!-- Raised wrist watch -->
            <g class="rig-prop">
              <rect x="132" y="148" width="22" height="16" rx="4" fill="#22262b" stroke="#d4a76a" stroke-width="2"/>
              <circle cx="143" cy="156" r="5" fill="#eef2f5"/>
              <path d="M143 156v-3m0 3l2.5 1.5" stroke="#c84b31" stroke-width="1.4" stroke-linecap="round"/>
            </g>
          </g>
        </svg>`,

      ken: `
        <svg class="char-svg" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g class="rig-body">
            <path d="M26 200c6-44 26-64 64-64s58 20 64 64H26z" fill="#5e5242" stroke="#262018" stroke-width="3"/>
            <rect x="74" y="138" width="32" height="62" fill="#ddd4c4" stroke="#262018" stroke-width="2.2"/>
            <rect x="78" y="110" width="24" height="32" rx="9" fill="#dcae8a" stroke="#2a1d17" stroke-width="2.4"/>
            <g class="rig-head">
              <ellipse cx="90" cy="86" rx="30" ry="30" fill="#e8ba98" stroke="#2a1d17" stroke-width="2.8"/>
              <path d="M52 66c8-24 68-24 76 0H52z" fill="#423b32" stroke="#201c18" stroke-width="2.6"/>
              <rect x="46" y="64" width="88" height="9" rx="4" fill="#2c2823"/>
              <g class="rig-brows">
                <path class="brow-l" d="M71 78h14" stroke="#30241d" stroke-width="3.2" stroke-linecap="round"/>
                <path class="brow-r" d="M95 78h14" stroke="#30241d" stroke-width="3.2" stroke-linecap="round"/>
              </g>
              <g class="rig-eyes">
                <circle cx="78" cy="86" r="3.5" fill="#1e1815"/>
                <circle cx="102" cy="86" r="3.5" fill="#1e1815"/>
              </g>
              <path d="M72 99c8-5 28-5 36 0" stroke="#47382e" stroke-width="6.5" stroke-linecap="round"/>
              <g class="rig-mouth">
                <path class="mouth-calm" d="M83 105c4 2.5 10 2.5 14 0" stroke="#5d3629" stroke-width="2.2" stroke-linecap="round"/>
                <ellipse class="mouth-talk" cx="90" cy="105" rx="5" ry="3.2" fill="#6b2e26"/>
              </g>
            </g>
          </g>
        </svg>`,

      shade: `
        <svg class="char-svg" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g class="rig-body">
            <path d="M22 200c8-48 28-68 68-68s60 20 68 68H22z" fill="#14181f" stroke="#080a0d" stroke-width="3"/>
            <path d="M54 134l36 32 36-32-10-18H64l-10 18z" fill="#242b36" stroke="#0d1015" stroke-width="2.4"/>
            <path d="M85 148h10l-2 46h-6l-2-46z" fill="#8b3226"/>
            <rect x="79" y="109" width="22" height="30" rx="8" fill="#b8a18e" stroke="#181c22" stroke-width="2.4"/>
            <g class="rig-head">
              <ellipse cx="90" cy="86" rx="26" ry="29" fill="#c7b29f" stroke="#181c22" stroke-width="2.6"/>
              <!-- Fedora hat -->
              <path d="M40 64h100v8H40z" fill="#0d1016"/>
              <path d="M56 64l9-32h50l9 32H56z" fill="#171c25" stroke="#0b0d12" stroke-width="2.6"/>
              <rect x="61" y="56" width="58" height="7" fill="#8b3f31"/>
              <!-- Glinting noir spectacles -->
              <g class="rig-eyes">
                <rect x="65" y="77" width="22" height="14" rx="4" fill="#0c1017" stroke="#d4a76a" stroke-width="2.2"/>
                <rect x="93" y="77" width="22" height="14" rx="4" fill="#0c1017" stroke="#d4a76a" stroke-width="2.2"/>
                <line x1="87" y1="84" x2="93" y2="84" stroke="#d4a76a" stroke-width="2"/>
                <path class="lens-glint" d="M69 80l7 7M97 80l7 7" stroke="#f7e3ba" stroke-width="2.4" stroke-linecap="round"/>
              </g>
              <g class="rig-mouth">
                <path class="mouth-calm" d="M81 102c5 1 13 1 18-1" stroke="#362c27" stroke-width="2.4" stroke-linecap="round"/>
                <ellipse class="mouth-talk" cx="90" cy="102" rx="5" ry="2.8" fill="#3a2520"/>
              </g>
            </g>
          </g>
        </svg>`,

      enforcer: `
        <svg class="char-svg" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g class="rig-body">
            <path d="M16 200c6-50 28-70 74-70s68 20 74 70H16z" fill="#181617" stroke="#090808" stroke-width="3"/>
            <path d="M77 132h26l-7 42H84l-7-42z" fill="#e8e2d8"/>
            <path d="M86 135h8l2 38h-12l2-38z" fill="#9a2e22"/>
            <rect x="75" y="108" width="30" height="30" rx="8" fill="#cda07e" stroke="#261c17" stroke-width="2.6"/>
            <g class="rig-head">
              <rect x="59" y="50" width="62" height="64" rx="20" fill="#d9ad8c" stroke="#261c17" stroke-width="3"/>
              <path d="M59 68c0-15 11-22 31-22s31 7 31 22v-5H59v5z" fill="#231c19"/>
              <g class="rig-eyes">
                <rect x="64" y="74" width="24" height="14" rx="3" fill="#0d0d0f" stroke="#444" stroke-width="1.5"/>
                <rect x="92" y="74" width="24" height="14" rx="3" fill="#0d0d0f" stroke="#444" stroke-width="1.5"/>
                <line x1="88" y1="80" x2="92" y2="80" stroke="#111" stroke-width="3"/>
              </g>
              <g class="rig-mouth">
                <path class="mouth-calm" d="M76 100h28" stroke="#452b23" stroke-width="3.2" stroke-linecap="round"/>
                <ellipse class="mouth-talk" cx="90" cy="100" rx="7" ry="4" fill="#5e241e"/>
              </g>
            </g>
          </g>
        </svg>`,

      don: `
        <svg class="char-svg" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g class="rig-body">
            <path d="M22 200c7-46 28-66 68-66s61 20 68 66H22z" fill="#1d1b22" stroke="#0b0a0e" stroke-width="3"/>
            <path d="M44 150v50M64 140v60M116 140v60M136 150v50" stroke="rgba(255,255,255,0.1)" stroke-width="1.6"/>
            <path d="M72 135l18 38 18-38H72z" fill="#efe9df"/>
            <path d="M85 139h10l3 33-8 9-8-9 3-33z" fill="#a82e20"/>
            <!-- Rose lapel pin -->
            <circle cx="118" cy="158" r="5" fill="#c83728"/>
            <rect x="78" y="108" width="24" height="32" rx="9" fill="#d9ab8a" stroke="#261b16" stroke-width="2.4"/>
            <g class="rig-head">
              <ellipse cx="90" cy="82" rx="29" ry="31" fill="#e5b898" stroke="#261b16" stroke-width="2.8"/>
              <path d="M60 72c2-26 58-26 60 0-8-12-52-12-60 0z" fill="#353136" stroke="#1b191c" stroke-width="2"/>
              <path d="M63 68c10-8 44-8 54 0" stroke="#7d777e" stroke-width="2.4"/>
              <g class="rig-brows">
                <path class="brow-l" d="M69 75l16 4" stroke="#261e1b" stroke-width="3.2" stroke-linecap="round"/>
                <path class="brow-r" d="M111 75l-16 4" stroke="#261e1b" stroke-width="3.2" stroke-linecap="round"/>
              </g>
              <g class="rig-eyes">
                <circle cx="78" cy="84" r="3.4" fill="#171311"/>
                <circle cx="102" cy="84" r="3.4" fill="#171311"/>
              </g>
              <path d="M74 96c8-3 24-3 32 0" stroke="#353136" stroke-width="5.5" stroke-linecap="round"/>
              <g class="rig-mouth">
                <path class="mouth-calm" d="M81 103c5-2 13-2 18 0" stroke="#542e23" stroke-width="2.4" stroke-linecap="round"/>
                <ellipse class="mouth-talk" cx="90" cy="103" rx="6" ry="3.8" fill="#69261e"/>
              </g>
            </g>
            <!-- Spinning 2066 1-cent gold coin! -->
            <g class="rig-prop coin-spin-anim">
              <circle cx="144" cy="132" r="13" fill="#d4a76a" stroke="#fbe6ad" stroke-width="2.4"/>
              <text x="144" y="136" text-anchor="middle" font-size="11" font-weight="800" fill="#472d0b">1</text>
            </g>
          </g>
        </svg>`,

      don_cern: `
        <svg class="char-svg" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g class="rig-body">
            <!-- Open dark mafia coat revealing gleaming white CERN lab coat underneath! -->
            <path d="M20 200c7-46 28-66 70-66s63 20 70 66H20z" fill="#1b1c22" stroke="#0b0c10" stroke-width="3"/>
            <path d="M48 136h84l10 64H38l10-64z" fill="#e6eef2" stroke="#22313b" stroke-width="2.6"/>
            <path d="M76 136l14 34 14-34H76z" fill="#233642"/>
            <rect x="78" y="108" width="24" height="32" rx="9" fill="#d9ab8a" stroke="#261b16" stroke-width="2.4"/>
            <!-- Glowing CERN atom emblem -->
            <g class="rig-prop">
              <circle cx="114" cy="164" r="12" stroke="#38bdf8" stroke-width="2"/>
              <ellipse cx="114" cy="164" rx="12" ry="4.5" transform="rotate(35 114 164)" stroke="#38bdf8" stroke-width="1.8"/>
              <ellipse cx="114" cy="164" rx="12" ry="4.5" transform="rotate(-35 114 164)" stroke="#38bdf8" stroke-width="1.8"/>
              <circle cx="114" cy="164" r="2.8" fill="#f59e0b"/>
            </g>
            <g class="rig-head">
              <ellipse cx="90" cy="82" rx="29" ry="31" fill="#e5b898" stroke="#261b16" stroke-width="2.8"/>
              <path d="M60 72c2-26 58-26 60 0-8-12-52-12-60 0z" fill="#4a4e54"/>
              <g class="rig-eyes">
                <circle cx="78" cy="84" r="3.4" fill="#171311"/>
                <circle cx="102" cy="84" r="3.4" fill="#171311"/>
              </g>
              <path d="M74 96c8-3 24-3 32 0" stroke="#4a4e54" stroke-width="5.2" stroke-linecap="round"/>
              <g class="rig-mouth">
                <path class="mouth-calm" d="M81 103c5 3 13 3 18 0" stroke="#542e23" stroke-width="2.4" stroke-linecap="round"/>
                <ellipse class="mouth-talk" cx="90" cy="103" rx="6" ry="3.8" fill="#69261e"/>
              </g>
            </g>
          </g>
        </svg>`,

      elena: `
        <svg class="char-svg" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g class="rig-body">
            <path d="M30 200c6-42 26-62 60-62s54 20 60 62H30z" fill="#e6eef2" stroke="#1e2d38" stroke-width="3"/>
            <path d="M74 138l16 34 16-34H74z" fill="#254860"/>
            <rect x="80" y="109" width="20" height="34" rx="8" fill="#e7c1a7" stroke="#291d19" stroke-width="2.4"/>
            <rect x="108" y="156" width="22" height="14" rx="2.5" fill="#16222d" stroke="#38bdf8" stroke-width="1.6"/>
            <line x1="112" y1="163" x2="126" y2="163" stroke="#f59e0b" stroke-width="2"/>
            <g class="rig-head">
              <path d="M52 94c0-34 16-54 38-54s38 20 38 54v22H52V94z" fill="#3b2822" stroke="#1d1411" stroke-width="2.6"/>
              <ellipse cx="90" cy="84" rx="27" ry="29" fill="#f5d1b8" stroke="#291d19" stroke-width="2.6"/>
              <g class="rig-brows">
                <path class="brow-l" d="M70 73l14 2" stroke="#32221c" stroke-width="2.4" stroke-linecap="round"/>
                <path class="brow-r" d="M110 73l-14 2" stroke="#32221c" stroke-width="2.4" stroke-linecap="round"/>
              </g>
              <g class="rig-eyes">
                <rect x="65" y="76" width="21" height="14" rx="5" stroke="#22384a" stroke-width="2.4" fill="rgba(56,189,248,0.16)"/>
                <rect x="94" y="76" width="21" height="14" rx="5" stroke="#22384a" stroke-width="2.4" fill="rgba(56,189,248,0.16)"/>
                <line x1="86" y1="83" x2="94" y2="83" stroke="#22384a" stroke-width="2"/>
                <circle cx="76" cy="83" r="3" fill="#1b232b"/>
                <circle cx="104" cy="83" r="3" fill="#1b232b"/>
              </g>
              <g class="rig-mouth">
                <path class="mouth-calm" d="M82 101c4 3 12 3 16 0" stroke="#7d4a3d" stroke-width="2.4" stroke-linecap="round"/>
                <ellipse class="mouth-talk" cx="90" cy="101" rx="5.5" ry="3.8" fill="#823830"/>
              </g>
            </g>
          </g>
        </svg>`,

      master: `
        <svg class="char-svg" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g class="rig-body">
            <!-- Zen dark robe / traditional vest with golden trim -->
            <path d="M24 200c8-46 28-66 66-66s58 20 66 66H24z" fill="#2c251e" stroke="#120f0c" stroke-width="3"/>
            <path d="M68 134l22 36 22-36" stroke="#d4a76a" stroke-width="4" fill="#3f3428"/>
            <path d="M78 134l12 22 12-22" fill="#f3e6cf"/>
            <rect x="78" y="109" width="24" height="32" rx="9" fill="#dfb28f" stroke="#2b1e16" stroke-width="2.4"/>
            <g class="rig-head">
              <ellipse cx="90" cy="84" rx="29" ry="30" fill="#ecc09e" stroke="#2b1e16" stroke-width="2.8"/>
              <!-- Iconic Flat Cap -->
              <path d="M50 64c8-24 72-24 80 0H50z" fill="#4f4438" stroke="#1e1914" stroke-width="2.6"/>
              <rect x="44" y="63" width="92" height="8" rx="4" fill="#2d261f"/>
              <!-- Round golden spectacles with anime glint! -->
              <g class="rig-eyes">
                <circle cx="76" cy="84" r="10.5" stroke="#d4a76a" stroke-width="2.8" fill="rgba(255,244,214,0.16)"/>
                <circle cx="104" cy="84" r="10.5" stroke="#d4a76a" stroke-width="2.8" fill="rgba(255,244,214,0.16)"/>
                <line x1="86.5" y1="84" x2="93.5" y2="84" stroke="#d4a76a" stroke-width="2.4"/>
                <circle cx="76" cy="84" r="3" fill="#1c1613"/>
                <circle cx="104" cy="84" r="3" fill="#1c1613"/>
                <path class="lens-glint" d="M71 79l7 7M99 79l7 7" stroke="#fff4d2" stroke-width="2.5" stroke-linecap="round"/>
              </g>
              <!-- Wise white mustache & beard -->
              <path d="M68 99c8-6 36-6 44 0-6 9-38 9-44 0z" fill="#ece6db" stroke="#7d7468" stroke-width="1.4"/>
              <path d="M82 108c4 10 12 10 16 0" fill="#ece6db"/>
              <g class="rig-mouth">
                <path class="mouth-calm" d="M84 103c3 2 9 2 12 0" stroke="#6d4b3b" stroke-width="2" stroke-linecap="round"/>
                <ellipse class="mouth-talk" cx="90" cy="103" rx="4.8" ry="3.2" fill="#633228"/>
              </g>
            </g>
          </g>
        </svg>`,

      master_future: `
        <svg class="char-svg" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g class="rig-body">
            <circle cx="90" cy="96" r="76" stroke="#d4a76a" stroke-width="1.5" stroke-dasharray="6 5" opacity="0.55"/>
            <path d="M24 200c8-46 28-66 66-66s58 20 66 66H24z" fill="#1f2733" stroke="#0d1118" stroke-width="3"/>
            <path d="M68 134l22 36 22-36" stroke="#38bdf8" stroke-width="3.6" fill="#293545"/>
            <rect x="78" y="109" width="24" height="32" rx="9" fill="#dfb28f" stroke="#1e2530" stroke-width="2.4"/>
            <g class="rig-head">
              <ellipse cx="90" cy="84" rx="29" ry="30" fill="#ecc09e" stroke="#1e2530" stroke-width="2.8"/>
              <path d="M60 72c4-24 56-24 60 0-8-10-52-10-60 0z" fill="#e2e8f0" stroke="#64748b" stroke-width="1.8"/>
              <g class="rig-eyes">
                <circle cx="76" cy="84" r="10.5" stroke="#38bdf8" stroke-width="2.8" fill="rgba(56,189,248,0.18)"/>
                <circle cx="104" cy="84" r="10.5" stroke="#38bdf8" stroke-width="2.8" fill="rgba(56,189,248,0.18)"/>
                <line x1="86.5" y1="84" x2="93.5" y2="84" stroke="#38bdf8" stroke-width="2.2"/>
                <circle cx="76" cy="84" r="3" fill="#0f172a"/>
                <circle cx="104" cy="84" r="3" fill="#0f172a"/>
                <path class="lens-glint" d="M71 79l7 7M99 79l7 7" stroke="#e0f2fe" stroke-width="2.6" stroke-linecap="round"/>
              </g>
              <path d="M68 99c8-6 36-6 44 0-6 8-38 8-44 0z" fill="#e6edf5"/>
              <g class="rig-mouth">
                <path class="mouth-calm" d="M83 104c4 3 10 3 14 0" stroke="#475569" stroke-width="2.2" stroke-linecap="round"/>
                <ellipse class="mouth-talk" cx="90" cy="104" rx="5" ry="3.2" fill="#475569"/>
              </g>
            </g>
          </g>
        </svg>`,

      void: `
        <svg class="char-svg" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g class="rig-body void-spin">
            <circle cx="90" cy="100" r="56" stroke="#d4a76a" stroke-width="2.4" opacity="0.7"/>
            <ellipse cx="90" cy="100" rx="76" ry="24" transform="rotate(-18 90 100)" stroke="#f59e0b" stroke-width="4" opacity="0.9"/>
            <ellipse cx="90" cy="100" rx="68" ry="18" transform="rotate(-18 90 100)" stroke="#38bdf8" stroke-width="2.2" opacity="0.75"/>
            <circle cx="90" cy="100" r="30" fill="#030508" stroke="#fde68a" stroke-width="2.4"/>
          </g>
        </svg>`,
    };
    return rigs[id] || rigs.shade;
  }

  /* =========================================================
     COUNTER PROPS (ITEMS DROPPED ONTO THE COUNTER)
     ========================================================= */
  const PROPS = {
    bread: `<svg viewBox="0 0 64 44"><ellipse cx="32" cy="26" rx="26" ry="13" fill="#d99a4e" stroke="#4a2e12" stroke-width="2.4"/><path d="M18 19l6 10M30 16l6 12M42 19l5 9" stroke="#8a521c" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    milk: `<svg viewBox="0 0 44 56"><path d="M14 14h16l4 10v26a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V24l4-10z" fill="#f7f9fc" stroke="#2c3d4f" stroke-width="2.4"/><rect x="15" y="7" width="14" height="7" rx="2" fill="#3b82f6" stroke="#1e3a5f" stroke-width="2"/><rect x="12" y="29" width="20" height="12" fill="#dbeafe"/></svg>`,
    coffee: `<svg viewBox="0 0 64 52"><rect x="8" y="12" width="48" height="34" rx="4" fill="#8b5a34" stroke="#362010" stroke-width="2.4"/><path d="M8 22h48" stroke="#362010" stroke-width="2"/><circle cx="32" cy="34" r="7" fill="#422312"/><path d="M29 29c2 4 2 6 0 10" stroke="#c89a66" stroke-width="1.6"/></svg>`,
    sandwich: `<svg viewBox="0 0 64 44"><path d="M10 34L32 10l22 24H10z" fill="#e6b368" stroke="#4f3314" stroke-width="2.4"/><path d="M16 30h32" stroke="#c84b31" stroke-width="3.5" stroke-linecap="round"/><path d="M18 26h28" stroke="#4ca154" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    invoice: `<svg viewBox="0 0 50 56"><rect x="8" y="6" width="34" height="44" rx="3" fill="#faf6ec" stroke="#3b352c" stroke-width="2.4"/><path d="M15 17h20M15 24h20M15 31h14" stroke="#7d7365" stroke-width="2.2" stroke-linecap="round"/><circle cx="32" cy="40" r="6" fill="none" stroke="#c84b31" stroke-width="2"/></svg>`,
    envelope: `<svg viewBox="0 0 66 46"><rect x="5" y="7" width="56" height="34" rx="3" fill="#1e222a" stroke="#d4a76a" stroke-width="2.2"/><path d="M6 8l27 18L60 8" stroke="#d4a76a" stroke-width="2" fill="none"/><circle cx="33" cy="25" r="6.5" fill="#b43222" stroke="#f5dfa6" stroke-width="1.5"/></svg>`,
    coin: `<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="16" fill="#d4a76a" stroke="#fde68a" stroke-width="2.6"/><text x="22" y="26" text-anchor="middle" font-size="11" font-weight="800" fill="#472d0b">0,01</text></svg>`,
    moneybag: `<svg viewBox="0 0 64 52"><rect x="8" y="14" width="48" height="32" rx="6" fill="#2e2a26" stroke="#111" stroke-width="2.4"/><path d="M22 14v-5h20v5" stroke="#111" stroke-width="2.6" fill="none"/><rect x="16" y="23" width="32" height="14" rx="2" fill="#3a7d4f" stroke="#173822" stroke-width="1.8"/><text x="32" y="33" text-anchor="middle" font-size="10" font-weight="800" fill="#d9f99d">$$$</text></svg>`,
    tea: `<svg viewBox="0 0 44 52"><path d="M12 10h20l-4 18 4 14H12l4-14-4-18z" fill="#b4431e" stroke="#f5e6d3" stroke-width="2.2"/><ellipse cx="22" cy="45" rx="16" ry="4" fill="#d9d2c5" stroke="#4a433a" stroke-width="1.8"/></svg>`,
    coil: `<svg viewBox="0 0 60 50"><rect x="10" y="12" width="40" height="28" rx="5" fill="#182a34" stroke="#38bdf8" stroke-width="2.4"/><path d="M16 18h28M16 26h28M16 34h28" stroke="#d48c46" stroke-width="3.2" stroke-linecap="round"/></svg>`,
    cryo: `<svg viewBox="0 0 46 56"><rect x="12" y="14" width="22" height="36" rx="8" fill="#cbd5e1" stroke="#0f172a" stroke-width="2.4"/><rect x="17" y="6" width="12" height="8" rx="2" fill="#38bdf8" stroke="#0f172a" stroke-width="2"/><text x="23" y="36" text-anchor="middle" font-size="9" font-weight="800" fill="#0284c7">He</text></svg>`,
    core: `<svg viewBox="0 0 54 54"><circle cx="27" cy="27" r="19" fill="#0f172a" stroke="#38bdf8" stroke-width="2.6"/><circle cx="27" cy="27" r="9" fill="#f59e0b"/><path d="M27 4v8M27 42v8M4 27h8M42 27h8" stroke="#38bdf8" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    capsule: `<svg viewBox="0 0 52 56"><path d="M26 4c10 10 14 22 14 34H12C12 26 16 14 26 4z" fill="#e2e8f0" stroke="#1e293b" stroke-width="2.4"/><circle cx="26" cy="24" r="5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.8"/><path d="M12 34l-6 10h10M40 34l6 10H36" fill="#c84b31"/><path d="M20 40l6 12 6-12" fill="#f59e0b"/></svg>`,
    receipt_star: `<svg viewBox="0 0 48 54"><path d="M10 6h28v42l-4-3-3 3-4-3-3 3-4-3-3 3-4-3-3 3V6z" fill="#fffdf6" stroke="#d4a76a" stroke-width="2.2"/><path d="M16 16h16M16 23h16M16 30h10" stroke="#7c7366" stroke-width="2"/><polygon points="32,33 34,37 38,37 35,40 36,44 32,42 28,44 29,40 26,37 30,37" fill="#f59e0b"/></svg>`,
  };

  function getPropSvg(id) {
    return PROPS[id] || PROPS.invoice;
  }

  /* =========================================================
     LIVE 16:9 STAGE CONTROLLER
     ========================================================= */
  function createStageController(containerEl) {
    let currentBg = "";
    let currentChar = "";

    function ensureMarkup() {
      if (containerEl.querySelector(".stage-viewport")) return;
      containerEl.innerHTML = `
        <div class="stage-viewport" data-bg="shop-day">
          <div class="stage-bg"></div>
          <div class="stage-env"></div>
          <div class="stage-char-slot"></div>
          <div class="stage-counter-bar">
            <div class="stage-props"></div>
            <div class="stage-cash-slot"></div>
          </div>
          <div class="stage-drawer" aria-hidden="true"></div>
          <div class="stage-fx-layer" aria-hidden="true"></div>
          <div class="stage-combo-badge" hidden></div>
          <div class="stage-loc-pill"></div>
        </div>
      `;
    }

    function buildEnvLayer(bgKey) {
      if (bgKey === "shop-day") {
        return `<div class="env-sunbeams"></div><div class="env-queue-silhouettes"></div>`;
      }
      if (bgKey === "shop-storm") {
        const drops = Array.from({ length: 18 }, (_, i) =>
          `<span class="rain-drop" style="left:${(i * 5.7) % 98}%;animation-delay:${(i * 0.13) % 1.1}s"></span>`
        ).join("");
        return `<div class="env-rain">${drops}</div><div class="env-lightning"></div><div class="env-van-lights"></div>`;
      }
      if (bgKey === "mafia-basement") {
        return `<div class="env-swing-lamp"><div class="lamp-cord"></div><div class="lamp-bulb"></div><div class="lamp-cone"></div></div>`;
      }
      if (bgKey === "syndicate-vault") {
        return `<div class="env-ticker"><span>AU +4.2% · Cu-COIL +18.6% · LHC-MAGNET [CLASSIFIED] · 1 KURUŞ = ∞ · MU %20 · </span></div><div class="env-siren-overlay"></div>`;
      }
      if (bgKey === "cern-lab") {
        return `<div class="env-cern-ring"></div><div class="env-scanlines"></div>`;
      }
      if (bgKey === "spacetime-rift") {
        return `
          <div class="env-blackhole-glow"></div>
          <div class="env-zerog-items">
            <span class="zg-item zg-1">${PROPS.receipt_star}</span>
            <span class="zg-item zg-2">${PROPS.bread}</span>
            <span class="zg-item zg-3">${PROPS.tea}</span>
          </div>
        `;
      }
      if (bgKey === "master-dojo") {
        const glyphs = ["00", "GT", "MU", "CE", "0,01", "M+"];
        const petals = glyphs
          .map(
            (g, i) =>
              `<span class="zen-glyph" style="left:${10 + i * 15}%;animation-delay:${i * 0.7}s">${g}</span>`
          )
          .join("");
        return `<div class="env-zen-mist"></div><div class="env-zen-glyphs">${petals}</div>`;
      }
      return "";
    }

    function setScene(opts) {
      ensureMarkup();
      const vp = containerEl.querySelector(".stage-viewport");
      const bgEl = containerEl.querySelector(".stage-bg");
      const envEl = containerEl.querySelector(".stage-env");
      const charSlot = containerEl.querySelector(".stage-char-slot");
      const propsEl = containerEl.querySelector(".stage-props");
      const cashSlot = containerEl.querySelector(".stage-cash-slot");
      const locPill = containerEl.querySelector(".stage-loc-pill");

      const bgKey = opts.backdrop || "shop-day";
      if (bgKey !== currentBg) {
        currentBg = bgKey;
        vp.dataset.bg = bgKey;
        const url = BG_MAP[bgKey] || BG_MAP["shop-day"];
        bgEl.style.backgroundImage = `url('${url}')`;
        envEl.innerHTML = buildEnvLayer(bgKey);
      }

      if (locPill) {
        locPill.textContent = opts.location || "";
        locPill.hidden = !opts.location;
      }

      // Character rig entry animation
      const charId = opts.character || "";
      if (charId) {
        const shouldWalk = opts.walkIn !== false && charId !== currentChar;
        currentChar = charId;
        charSlot.innerHTML = `<div class="stage-char ${shouldWalk ? "anim-walk-in" : "anim-fade-in"}" data-state="${opts.moodState || "idle"}">${getCharacterRig(charId)}</div>`;
      } else {
        currentChar = "";
        charSlot.innerHTML = "";
      }

      // Counter Props
      propsEl.innerHTML = "";
      if (Array.isArray(opts.props) && opts.props.length > 0) {
        opts.props.forEach((pId, idx) => {
          const wrap = document.createElement("div");
          wrap.className = "counter-prop";
          wrap.style.animationDelay = `${0.12 + idx * 0.1}s`;
          wrap.innerHTML = getPropSvg(pId);
          propsEl.appendChild(wrap);
        });
      }

      // Cash bill slid onto counter
      cashSlot.innerHTML = "";
      if (opts.cashLabel) {
        cashSlot.innerHTML = `<div class="counter-bill"><span>${opts.cashLabel}</span></div>`;
      }
    }

    function setCharacterState(moodState) {
      const ch = containerEl.querySelector(".stage-char");
      if (ch) ch.dataset.state = moodState || "idle";
    }

    function setCombo(combo) {
      const badge = containerEl.querySelector(".stage-combo-badge");
      if (!badge) return;
      if (combo >= 2) {
        badge.textContent = `COMBO ×${combo}`;
        badge.hidden = false;
        badge.classList.remove("pop");
        void badge.offsetWidth;
        badge.classList.add("pop");
      } else {
        badge.hidden = true;
      }
    }

    function spawnFloatingText(text, kind) {
      const fx = containerEl.querySelector(".stage-fx-layer");
      if (!fx) return;
      const el = document.createElement("div");
      el.className = `fx-float fx-${kind || "score"}`;
      el.textContent = text;
      fx.appendChild(el);
      setTimeout(() => el.remove(), 1250);
    }

    function playPayOut(scoreText, isCash) {
      setCharacterState("happy");
      const drawer = containerEl.querySelector(".stage-drawer");
      const fx = containerEl.querySelector(".stage-fx-layer");
      if (drawer && isCash) {
        drawer.classList.remove("open");
        void drawer.offsetWidth;
        drawer.classList.add("open");
        setTimeout(() => drawer.classList.remove("open"), 700);
      }
      if (fx) {
        // Flying banknotes / sparks burst!
        const count = isCash ? 6 : 8;
        for (let i = 0; i < count; i++) {
          const p = document.createElement("span");
          p.className = isCash ? "fx-bill" : "fx-spark";
          const dx = (Math.random() - 0.5) * 180;
          const dy = -60 - Math.random() * 90;
          const rot = (Math.random() - 0.5) * 90;
          p.style.setProperty("--dx", `${dx}px`);
          p.style.setProperty("--dy", `${dy}px`);
          p.style.setProperty("--rot", `${rot}deg`);
          p.style.animationDelay = `${i * 0.04}s`;
          fx.appendChild(p);
          setTimeout(() => p.remove(), 950);
        }
      }
      if (scoreText) spawnFloatingText(scoreText, "score");
    }

    function playErrorEffect() {
      setCharacterState("angry");
      const vp = containerEl.querySelector(".stage-viewport");
      if (vp) {
        vp.classList.remove("stage-error-flash");
        void vp.offsetWidth;
        vp.classList.add("stage-error-flash");
        setTimeout(() => vp.classList.remove("stage-error-flash"), 480);
      }
      // Also shake the calculator hardware slightly!
      const calc = document.querySelector(".calculator");
      if (calc) {
        calc.classList.remove("calc-shake");
        void calc.offsetWidth;
        calc.classList.add("calc-shake");
        setTimeout(() => calc.classList.remove("calc-shake"), 380);
      }
    }

    function playSpecialEvent(eventName) {
      const vp = containerEl.querySelector(".stage-viewport");
      const fx = containerEl.querySelector(".stage-fx-layer");
      if (!vp || !fx) return;

      if (eventName === "lightning") {
        const l = vp.querySelector(".env-lightning");
        if (l) {
          l.classList.remove("flash");
          void l.offsetWidth;
          l.classList.add("flash");
        }
      } else if (eventName === "van-lights") {
        const v = vp.querySelector(".env-van-lights");
        if (v) {
          v.classList.remove("sweep");
          void v.offsetWidth;
          v.classList.add("sweep");
        }
      } else if (eventName === "siren-raid") {
        const s = vp.querySelector(".env-siren-overlay");
        if (s) s.classList.add("active");
        const cracks = document.createElement("div");
        cracks.className = "fx-glass-shatter";
        fx.appendChild(cracks);
        setTimeout(() => cracks.remove(), 1200);
      } else if (eventName === "rocket-launch") {
        const rocket = document.createElement("div");
        rocket.className = "fx-rocket-launch";
        rocket.innerHTML = PROPS.capsule;
        fx.appendChild(rocket);
        const flash = document.createElement("div");
        flash.className = "fx-white-flash";
        fx.appendChild(flash);
        setTimeout(() => {
          rocket.remove();
          flash.remove();
        }, 1600);
      }
    }

    return {
      setScene,
      setCharacterState,
      setCombo,
      spawnFloatingText,
      playPayOut,
      playErrorEffect,
      playSpecialEvent,
    };
  }

  const api = {
    BG_MAP,
    PROPS,
    getCharacterRig,
    getPropSvg,
    createStageController,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.EsnafStage = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
