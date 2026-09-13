import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  DEFAULT_PALETTE,
  resolveInitialPalette,
  type PaletteName,
} from "../palettes";

const DOME_COLORS: Record<PaletteName, { ring: number }> = {
  violet: {
    ring: 0x9d6bff,
  },
  maroon: {
    ring: 0x8a2a38,
  },
  ice: {
    ring: 0x4fd6ff,
  },
  ember: {
    ring: 0xf0a13c,
  },
};

/** Wireframe dome + rings from the vibe-coded tech-stack shot */
const TechStackGlobe = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0.5, 16);
    camera.lookAt(0, -1.5, -4);

    const initName = resolveInitialPalette();
    const initColors = DOME_COLORS[initName] || DOME_COLORS[DEFAULT_PALETTE];

    const domeGroup = new THREE.Group();
    domeGroup.position.set(0, -2.5, -4);
    scene.add(domeGroup);

    const domeMat = new THREE.MeshBasicMaterial({
      color: initColors.ring,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(7, 48, 28),
      domeMat
    );
    domeGroup.add(dome);

    const domeRings: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const rr = new THREE.Mesh(
        new THREE.TorusGeometry(4.5 + i * 1.6, 0.01, 6, 180),
        domeMat
      );
      rr.rotation.x = Math.PI / 2;
      rr.position.y = 0.3 + i * 0.35;
      domeGroup.add(rr);
      domeRings.push(rr);
    }

    const pGeo = new THREE.BufferGeometry();
    const N = 180;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: initColors.ring,
        size: 0.025,
        transparent: true,
        opacity: 0.45,
      })
    );
    scene.add(dust);

    const applyDomePalette = (name: PaletteName) => {
      const C = DOME_COLORS[name];
      if (!C) return;
      domeMat.color.setHex(C.ring);
      (dust.material as THREE.PointsMaterial).color.setHex(C.ring);
      // Cream bg needs a bit more wire opacity to read
      domeMat.opacity = name === "maroon" ? 0.28 : 0.16;
      renderer.toneMappingExposure = name === "maroon" ? 1.25 : 1.1;
    };

    const onPalette = (event: Event) => {
      const detail = (event as CustomEvent<{ name: PaletteName }>).detail;
      if (detail?.name) applyDomePalette(detail.name);
    };
    window.addEventListener("palettechange", onPalette);
    applyDomePalette(initName);

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!reduceMotion) {
        domeGroup.rotation.y = now * 0.00006;
        domeRings.forEach((r, i) => {
          r.rotation.z = now * 0.00004 * (i % 2 ? 1 : -1);
        });
        dust.rotation.y = now * 0.00004;
      }
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("palettechange", onPalette);
      renderer.dispose();
      dome.geometry.dispose();
      domeMat.dispose();
      domeRings.forEach((r) => r.geometry.dispose());
      pGeo.dispose();
      (dust.material as THREE.PointsMaterial).dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="techstack-globe" ref={mountRef} aria-hidden="true" />
  );
};

export default TechStackGlobe;
