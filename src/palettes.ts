export type PaletteName = "violet" | "maroon" | "ice" | "ember";

export type PaletteDef = {
  label: string;
  swatch: string;
  /** Extra swatch ring for light themes (maroon cream ring) */
  swatchRing?: string;
  css: Record<string, string>;
  lights: {
    directional: number;
    point: number;
  };
};

/** Palettes from the vibe-coded robot design */
export const PALETTES: Record<PaletteName, PaletteDef> = {
  violet: {
    label: "Violet",
    swatch: "#a56cf5",
    css: {
      "--backgroundColor": "#050507",
      "--accentColor": "#a56cf5",
      "--accent-deep": "#5b2bb8",
      "--ink": "#f3f1f8",
      "--muted": "#9c97b3",
      "--line": "rgba(255,255,255,.35)",
      "--glow": "#e9c7ff",
      "--glow-hot": "#c481ff",
      "--glow-inset": "rgba(91, 43, 184, 0.6)",
      "--accent-rgb": "165, 108, 245",
      "--orb": "#e9c7ff",
      "--orb-glow": "190,120,255",
      "--orb-glow2": "120,60,220",
    },
    lights: { directional: 0xa56cf5, point: 0xa56cf5 },
  },
  maroon: {
    label: "Maroon & cream",
    swatch: "#7a1e2e",
    swatchRing: "#f4ecdf",
    css: {
      "--backgroundColor": "#f4ecdf",
      "--accentColor": "#7a1e2e",
      "--accent-deep": "#b8464f",
      "--ink": "#3a1218",
      "--muted": "#8a6a6e",
      "--line": "rgba(58,18,24,.35)",
      "--glow": "#d0505c",
      "--glow-hot": "#e0473c",
      "--glow-inset": "rgba(122, 30, 46, 0.55)",
      "--accent-rgb": "122, 30, 46",
      "--orb": "#7a1e2e",
      "--orb-glow": "150,40,60",
      "--orb-glow2": "200,90,80",
    },
    lights: { directional: 0xd0505c, point: 0xd0505c },
  },
  ice: {
    label: "Ice",
    swatch: "#3cc9f2",
    css: {
      "--backgroundColor": "#04080d",
      "--accentColor": "#3cc9f2",
      "--accent-deep": "#0e5a7a",
      "--ink": "#eaf6ff",
      "--muted": "#7f9db3",
      "--line": "rgba(255,255,255,.35)",
      "--glow": "#c9f1ff",
      "--glow-hot": "#3cc9f2",
      "--glow-inset": "rgba(14, 90, 122, 0.6)",
      "--accent-rgb": "60, 201, 242",
      "--orb": "#c9f1ff",
      "--orb-glow": "80,200,255",
      "--orb-glow2": "20,110,160",
    },
    lights: { directional: 0x3cc9f2, point: 0x3cc9f2 },
  },
  ember: {
    label: "Ember",
    swatch: "#f0a13c",
    css: {
      "--backgroundColor": "#0a0705",
      "--accentColor": "#f0a13c",
      "--accent-deep": "#8a4a12",
      "--ink": "#fbf3e6",
      "--muted": "#a89479",
      "--line": "rgba(255,255,255,.35)",
      "--glow": "#ffd9a3",
      "--glow-hot": "#ff9a2e",
      "--glow-inset": "rgba(138, 74, 18, 0.6)",
      "--accent-rgb": "240, 161, 60",
      "--orb": "#ffd9a3",
      "--orb-glow": "255,170,70",
      "--orb-glow2": "200,90,20",
    },
    lights: { directional: 0xf0a13c, point: 0xf0a13c },
  },
};

export const DEFAULT_PALETTE: PaletteName = "maroon";

export const PALETTE_ORDER: PaletteName[] = [
  "violet",
  "maroon",
  "ice",
  "ember",
];

export function applyPalette(name: PaletteName) {
  const P = PALETTES[name];
  if (!P) return;
  const root = document.documentElement;
  root.setAttribute("data-palette", name);
  for (const [key, value] of Object.entries(P.css)) {
    root.style.setProperty(key, value);
  }
  document.body.style.backgroundColor = P.css["--backgroundColor"];
  try {
    localStorage.setItem("palette", name);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(
    new CustomEvent("palettechange", { detail: { name, palette: P } })
  );
}

export function resolveInitialPalette(): PaletteName {
  try {
    const fromUrl = new URLSearchParams(location.search).get("palette");
    if (fromUrl && fromUrl in PALETTES) return fromUrl as PaletteName;
    const saved = localStorage.getItem("palette");
    if (saved && saved in PALETTES) return saved as PaletteName;
  } catch {
    /* ignore */
  }
  return DEFAULT_PALETTE;
}
