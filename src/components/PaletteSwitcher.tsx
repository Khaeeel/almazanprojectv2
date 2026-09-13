import { useEffect, useState } from "react";
import {
  applyPalette,
  DEFAULT_PALETTE,
  PALETTE_ORDER,
  PALETTES,
  resolveInitialPalette,
  type PaletteName,
} from "../palettes";

const PaletteSwitcher = () => {
  const [active, setActive] = useState<PaletteName>(DEFAULT_PALETTE);

  useEffect(() => {
    const initial = resolveInitialPalette();
    applyPalette(initial);
    setActive(initial);
  }, []);

  const onSelect = (name: PaletteName) => {
    applyPalette(name);
    setActive(name);
  };

  return (
    <div className="palettes" role="group" aria-label="Color palette">
      {PALETTE_ORDER.map((name) => {
        const P = PALETTES[name];
        return (
          <button
            key={name}
            type="button"
            data-palette={name}
            aria-pressed={active === name}
            onClick={() => onSelect(name)}
          >
            <i
              style={{
                background: P.swatch,
                boxShadow: P.swatchRing
                  ? `inset 0 0 0 3px ${P.swatchRing}`
                  : undefined,
              }}
            />
            <span>{P.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PaletteSwitcher;
