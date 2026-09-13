import * as THREE from "three";
import {
  resolveInitialPalette,
  type PaletteName,
} from "../../../palettes";

export type RobotMaterials = {
  graphite: THREE.MeshStandardMaterial;
  smooth: THREE.MeshStandardMaterial;
  chrome: THREE.MeshStandardMaterial;
  seam: THREE.MeshStandardMaterial;
  lensMat: THREE.MeshStandardMaterial;
  irisMat: THREE.MeshStandardMaterial;
  deskMat: THREE.MeshStandardMaterial;
  screenMat: THREE.MeshStandardMaterial;
  ringMat: THREE.MeshBasicMaterial;
  tabletMat: THREE.MeshStandardMaterial;
};

export type RobotInstance = {
  character: THREE.Group;
  materials: RobotMaterials;
  applyPalette: (name: PaletteName) => void;
  update: (now: number) => void;
};

const ROBOT_COLORS: Record<
  PaletteName,
  {
    graphite: number;
    smooth: number;
    chrome: number;
    desk: number;
    seam: number;
    lens: number;
    lensBase: number;
    iris: number;
    ring: number;
    screen: number;
    screenBase: number;
    eyeGlow: [string, string];
    halo: [string, string];
    exposure: number;
  }
> = {
  violet: {
    graphite: 0x1c1b24,
    smooth: 0x24222e,
    chrome: 0xc4bfd6,
    desk: 0xd9d4e6,
    seam: 0x8a4dff,
    lens: 0x7a3cff,
    lensBase: 0x1a0a33,
    iris: 0xe9dcff,
    ring: 0x9d6bff,
    screen: 0xd25a9a,
    screenBase: 0x2a0a2a,
    eyeGlow: ["rgba(190,150,255,0.7)", "rgba(140,80,255,0.2)"],
    halo: ["rgba(110,50,210,0.45)", "rgba(70,25,150,0.15)"],
    exposure: 1.1,
  },
  maroon: {
    graphite: 0x2b0f14,
    smooth: 0x3d161d,
    chrome: 0xe8d9c3,
    desk: 0xefe3d0,
    seam: 0xe0473c,
    lens: 0xc8303a,
    lensBase: 0x2a0a0d,
    iris: 0xfff1e0,
    ring: 0x8a2a38,
    screen: 0xd8535a,
    screenBase: 0x2a0a0d,
    eyeGlow: ["rgba(255,140,120,0.7)", "rgba(200,50,60,0.2)"],
    halo: ["rgba(180,60,70,0.28)", "rgba(150,40,60,0.1)"],
    exposure: 1.25,
  },
  ice: {
    graphite: 0x121a22,
    smooth: 0x1a2630,
    chrome: 0xbcd3e0,
    desk: 0xd6e4ee,
    seam: 0x2fd4ff,
    lens: 0x1ab8ff,
    lensBase: 0x061a26,
    iris: 0xe0fbff,
    ring: 0x4fd6ff,
    screen: 0x3cc9f2,
    screenBase: 0x06202c,
    eyeGlow: ["rgba(160,235,255,0.7)", "rgba(40,190,255,0.2)"],
    halo: ["rgba(40,160,230,0.4)", "rgba(10,90,140,0.15)"],
    exposure: 1.1,
  },
  ember: {
    graphite: 0x1f1712,
    smooth: 0x2a1f17,
    chrome: 0xd6c4a8,
    desk: 0xe6d8c4,
    seam: 0xff9a2e,
    lens: 0xff7a1a,
    lensBase: 0x2a1206,
    iris: 0xfff0d6,
    ring: 0xf0a13c,
    screen: 0xf0a13c,
    screenBase: 0x2a1206,
    eyeGlow: ["rgba(255,210,140,0.7)", "rgba(255,140,40,0.2)"],
    halo: ["rgba(220,130,40,0.4)", "rgba(150,70,10,0.15)"],
    exposure: 1.1,
  },
};

function glowTexture(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, inner);
  grd.addColorStop(0.4, outer);
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const UP = new THREE.Vector3(0, 1, 0);

function limb(
  a: number[],
  b: number[],
  r: number,
  mat: THREE.Material,
  parent: THREE.Object3D
) {
  const A = new THREE.Vector3(...a);
  const B = new THREE.Vector3(...b);
  const d = new THREE.Vector3().subVectors(B, A);
  const len = d.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 16), mat);
  m.position.copy(A).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(UP, d.normalize());
  parent.add(m);
  return m;
}

function joint(
  p: number[],
  r: number,
  mat: THREE.Material,
  parent: THREE.Object3D
) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 16), mat);
  m.position.set(p[0], p[1], p[2]);
  parent.add(m);
  return m;
}

/** Procedural seated robot from the vibe-coded design, with names the existing scroll/mouse system expects. */
export function buildRobot(): RobotInstance {
  const graphite = new THREE.MeshStandardMaterial({
    color: 0x1c1b24,
    metalness: 0.9,
    roughness: 0.35,
    flatShading: true,
  });
  const smooth = new THREE.MeshStandardMaterial({
    color: 0x24222e,
    metalness: 0.85,
    roughness: 0.3,
  });
  const chrome = new THREE.MeshStandardMaterial({
    color: 0xc4bfd6,
    metalness: 1.0,
    roughness: 0.2,
  });
  const seam = new THREE.MeshStandardMaterial({
    color: 0x120c22,
    emissive: 0x8a4dff,
    emissiveIntensity: 1.5,
  });
  const lensMat = new THREE.MeshStandardMaterial({
    color: 0x1a0a33,
    emissive: 0x7a3cff,
    emissiveIntensity: 1.6,
    roughness: 0.2,
  });
  const irisMat = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0xe9dcff,
    emissiveIntensity: 3.0,
  });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0a0514 });
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x9d6bff,
    transparent: true,
    opacity: 0.3,
  });
  const deskMat = new THREE.MeshStandardMaterial({
    color: 0xd9d4e6,
    metalness: 0.2,
    roughness: 0.5,
  });
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x2a0a2a,
    emissive: 0xd25a9a,
    emissiveIntensity: 0.9,
    roughness: 0.4,
  });
  const tabletMat = screenMat.clone();

  let eyeGlowTex = glowTexture(
    "rgba(190,150,255,0.7)",
    "rgba(140,80,255,0.2)"
  );
  const headGlowTex = glowTexture(
    "rgba(110,50,210,0.45)",
    "rgba(70,25,150,0.15)"
  );

  const character = new THREE.Group();
  character.name = "character";

  // Compatible bones: spine005 (neck) → spine006 (head) for existing mouse/scroll code
  const spine005 = new THREE.Group();
  spine005.name = "spine005";
  spine005.position.set(0, 0.1, 0);
  character.add(spine005);

  const spine006 = new THREE.Group();
  spine006.name = "spine006";
  spine005.add(spine006);

  const head = spine006;

  const cranium = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 2), graphite);
  cranium.scale.set(0.95, 1.1, 0.95);
  head.add(cranium);

  [-1, 1].forEach((s) => {
    const cheek = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.22), smooth);
    cheek.position.set(s * 0.55, -0.32, 0.72);
    cheek.rotation.y = s * 0.55;
    cheek.rotation.x = 0.1;
    head.add(cheek);
  });

  const chin = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.32, 0.4), smooth);
  chin.position.set(0, -0.78, 0.6);
  chin.rotation.x = 0.35;
  head.add(chin);

  const brow = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.03, 0.06), seam);
  brow.position.set(0, 0.5, 0.86);
  brow.rotation.x = -0.35;
  head.add(brow);

  const crest = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.75, 0.03), seam);
  crest.position.set(0, 0.85, 0.5);
  crest.rotation.x = 0.7;
  head.add(crest);

  [-1, 1].forEach((s) => {
    const pod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.1, 24),
      chrome
    );
    pod.rotation.z = Math.PI / 2;
    pod.position.set(s * 0.98, 0.05, 0);
    head.add(pod);
    const dot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.12, 16),
      seam
    );
    dot.rotation.z = Math.PI / 2;
    dot.position.set(s * 1.0, 0.05, 0);
    head.add(dot);
  });

  type EyeData = {
    eye: THREE.Group;
    mov: THREE.Object3D[];
    glow: THREE.Sprite;
    base: number;
  };
  const eyes: EyeData[] = [];

  [-1, 1].forEach((s) => {
    const eye = new THREE.Group();
    eye.position.set(s * 0.36, 0.12, 0.78);
    eye.rotation.y = s * 0.22;
    const socket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.23, 0.26, 0.26, 32),
      smooth
    );
    socket.rotation.x = Math.PI / 2;
    eye.add(socket);
    const rimRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.03, 12, 40),
      chrome
    );
    rimRing.position.z = 0.14;
    eye.add(rimRing);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.19, 40), lensMat);
    lens.position.z = 0.13;
    eye.add(lens);
    const iris = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.1, 40), irisMat);
    iris.position.z = 0.15;
    eye.add(iris);
    const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.058, 32), pupilMat);
    pupil.position.z = 0.152;
    eye.add(pupil);
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: eyeGlowTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.7,
      })
    );
    glow.scale.set(0.55, 0.55, 1);
    glow.position.z = 0.2;
    eye.add(glow);
    eyes.push({ eye, mov: [iris, pupil], glow, base: eye.rotation.y });
    head.add(eye);
  });

  // Neck + torso
  limb([0, -0.9, 0], [0, -1.5, 0], 0.28, chrome, character);
  for (let i = 0; i < 3; i++) {
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.025, 8, 32), graphite);
    r.rotation.x = Math.PI / 2;
    r.position.y = -1.1 - i * 0.2;
    character.add(r);
  }
  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.78, 0.62, 2.1, 10),
    graphite
  );
  torso.position.set(0, -2.6, 0.05);
  character.add(torso);
  const chest = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.3), smooth);
  chest.position.set(0, -2.1, 0.62);
  character.add(chest);
  const chestSeam = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.5, 0.04), seam);
  chestSeam.position.set(0, -2.1, 0.79);
  character.add(chestSeam);
  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.5, 0.9), smooth);
  pelvis.position.set(0, -3.75, 0.25);
  character.add(pelvis);

  const hands: THREE.Mesh[] = [];
  [-1, 1].forEach((s) => {
    const sh = [s * 0.95, -1.85, 0.05];
    const el = [s * 0.95, -3.05, 0.75];
    const hd = [s * 0.5, -3.25, 1.85];
    joint(sh, 0.28, chrome, character);
    limb(sh, el, 0.2, graphite, character);
    joint(el, 0.2, chrome, character);
    limb(el, hd, 0.17, graphite, character);
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.42), smooth);
    hand.position.set(hd[0], hd[1], hd[2]);
    hands.push(hand);
    character.add(hand);
  });

  [-1, 1].forEach((s) => {
    const hip = [s * 0.42, -3.95, 0.3];
    const kn = [s * 0.48, -4.05, 1.65];
    const an = [s * 0.48, -5.7, 1.55];
    limb(hip, kn, 0.26, graphite, character);
    joint(kn, 0.27, chrome, character);
    limb(kn, an, 0.2, graphite, character);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.22, 0.75), smooth);
    foot.name = s < 0 ? "footL" : "footR";
    foot.position.set(s * 0.48, -5.85, 1.75);
    character.add(foot);
  });

  // Chair
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.12, 1.4), deskMat);
  seat.position.set(0, -4.1, 0.35);
  character.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.9, 0.12), deskMat);
  back.position.set(0, -3.2, -0.4);
  character.add(back);
  [-0.7, 0.7].forEach((x) => {
    limb([x, -4.15, -0.2], [x * 1.15, -6.0, -0.75], 0.04, deskMat, character);
    limb([x, -4.15, 0.9], [x * 1.15, -6.0, 1.2], 0.04, deskMat, character);
  });

  // Desk + laptop — hidden on hero; revealed in GsapScroll desk shot
  const deskProps = new THREE.Group();
  deskProps.name = "deskProps";
  deskProps.scale.setScalar(0.01);
  character.add(deskProps);

  const top = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.1, 1.8), deskMat);
  top.position.set(0.3, -3.42, 2.35);
  deskProps.add(top);
  (
    [
      [-2.2, 1.6],
      [-2.2, 3.1],
      [2.8, 1.6],
      [2.8, 3.1],
    ] as [number, number][]
  ).forEach(([x, z]) =>
    limb([x, -3.45, z], [x, -6.0, z], 0.05, deskMat, deskProps)
  );

  const kb = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.08, 0.55),
    new THREE.MeshStandardMaterial({ color: 0x3a2440, roughness: 0.6 })
  );
  kb.position.set(0, -3.33, 1.95);
  deskProps.add(kb);

  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.1), deskMat);
  stand.position.set(0.6, -3.1, 2.95);
  deskProps.add(stand);

  const screen = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.7, 0.08), deskMat);
  screen.position.set(0.6, -2.0, 2.95);
  deskProps.add(screen);

  // Plane004 + Material.027 — required by existing GsapScroll monitor fade/slide
  const plane004 = new THREE.Group();
  plane004.name = "Plane004";
  plane004.position.set(0.6, -2.0, 2.9);
  plane004.rotation.y = Math.PI;
  const monitor = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 1.5),
    screenMat
  );
  screenMat.name = "Material.027";
  screenMat.transparent = true;
  screenMat.opacity = 0;
  plane004.add(monitor);
  deskProps.add(plane004);

  const screenLight = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 1.5),
    screenMat.clone()
  );
  screenLight.name = "screenlight";
  screenLight.position.set(0.6, -2.0, 2.91);
  screenLight.rotation.y = Math.PI;
  screenLight.material.transparent = true;
  screenLight.material.opacity = 0;
  screenLight.material.emissiveIntensity = 0.9;
  deskProps.add(screenLight);

  const tablet = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.75, 0.05),
    tabletMat
  );
  tablet.position.set(1.85, -3.0, 2.55);
  tablet.rotation.set(-0.25, 0.35, 0);
  deskProps.add(tablet);

  const floorGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: headGlowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.55,
    })
  );
  floorGlow.scale.set(11, 4, 1);
  floorGlow.position.set(0.3, -6.2, 1.4);
  deskProps.add(floorGlow);

  // Match original bust framing (camera ~14.5° / z 24.7)
  character.scale.setScalar(1.55);
  character.position.set(0, 13.9, 0.4);

  const materials: RobotMaterials = {
    graphite,
    smooth,
    chrome,
    seam,
    lensMat,
    irisMat,
    deskMat,
    screenMat,
    ringMat,
    tabletMat,
  };

  const eyeSprites = eyes.map((e) => e.glow);

  const applyPalette = (name: PaletteName) => {
    const C = ROBOT_COLORS[name];
    if (!C) return;
    graphite.color.setHex(C.graphite);
    smooth.color.setHex(C.smooth);
    chrome.color.setHex(C.chrome);
    deskMat.color.setHex(C.desk);
    seam.emissive.setHex(C.seam);
    lensMat.emissive.setHex(C.lens);
    lensMat.color.setHex(C.lensBase);
    irisMat.emissive.setHex(C.iris);
    ringMat.color.setHex(C.ring);
    screenMat.emissive.setHex(C.screen);
    screenMat.color.setHex(C.screenBase);
    tabletMat.emissive.setHex(C.screen);
    tabletMat.color.setHex(C.screenBase);
    (screenLight.material as THREE.MeshStandardMaterial).emissive.setHex(
      C.screen
    );
    (screenLight.material as THREE.MeshStandardMaterial).color.setHex(
      C.screenBase
    );
    eyeGlowTex = glowTexture(...C.eyeGlow);
    eyeSprites.forEach((sp) => {
      sp.material.map = eyeGlowTex;
      sp.material.needsUpdate = true;
    });
    floorGlow.material.map = glowTexture(...C.halo);
    floorGlow.material.needsUpdate = true;
  };

  applyPalette(resolveInitialPalette());

  const onPalette = (event: Event) => {
    const detail = (event as CustomEvent<{ name: PaletteName }>).detail;
    if (detail?.name) applyPalette(detail.name);
  };
  window.addEventListener("palettechange", onPalette);

  let blinkT = 0;
  let nextBlink = 4500;

  const update = (now: number) => {
    // Subtle idle glow / blink — does not touch GSAP scroll timelines
    lensMat.emissiveIntensity = 1.5 + Math.sin(now * 0.0025) * 0.3;
    seam.emissiveIntensity = 1.5 + Math.sin(now * 0.0011) * 0.2;
    head.position.y = Math.sin(now * 0.0011) * 0.02;

    if (now > nextBlink) {
      blinkT = now;
      nextBlink = now + 2600 + Math.random() * 4200;
    }
    const dt = now - blinkT;
    const blink = dt < 150 ? 1 - Math.sin((dt / 150) * Math.PI) * 0.9 : 1;
    eyes.forEach(({ eye, glow }) => {
      glow.material.opacity = 0.7 * blink;
      eye.scale.y = 0.2 + 0.8 * blink;
    });

    // Light typing when scrolled into desk shot
    const deskShot = window.scrollY > window.innerHeight * 0.8;
    hands.forEach((h, i) => {
      const k = deskShot
        ? Math.max(0, Math.sin(now * 0.014 + i * Math.PI)) * 0.06
        : 0;
      h.position.y = -3.25 + k;
    });
  };

  return { character, materials, applyPalette, update };
}
