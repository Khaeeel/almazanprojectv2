import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";
import {
  PALETTES,
  resolveInitialPalette,
  type PaletteDef,
  type PaletteName,
} from "../../../palettes";

/**
 * Keep the original character HDR, but recolor its reflections toward the
 * active palette (luminance preserved, chroma shifted).
 */
function buildTintedEnv(
  renderer: THREE.WebGLRenderer,
  hdr: THREE.Texture,
  tintHex: number
): THREE.Texture {
  const color = new THREE.Color(tintHex);
  const w = 512;
  const h = 256;
  const rt = new THREE.WebGLRenderTarget(w, h, {
    type: THREE.HalfFloatType,
    colorSpace: THREE.LinearSRGBColorSpace,
  });

  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quadScene = new THREE.Scene();
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: hdr },
      tint: { value: color },
      strength: { value: 0.88 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform sampler2D map;
      uniform vec3 tint;
      uniform float strength;
      varying vec2 vUv;
      void main() {
        vec4 tex = texture2D(map, vUv);
        float lum = dot(max(tex.rgb, vec3(0.0)), vec3(0.2126, 0.7152, 0.0722));
        vec3 colored = tint * (0.25 + lum * 2.2);
        vec3 outc = mix(tex.rgb, colored, strength);
        gl_FragColor = vec4(outc, 1.0);
      }
    `,
    depthTest: false,
    depthWrite: false,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  quadScene.add(quad);

  const prev = renderer.getRenderTarget();
  const prevAutoClear = renderer.autoClear;
  renderer.autoClear = true;
  renderer.setRenderTarget(rt);
  renderer.render(quadScene, cam);
  renderer.setRenderTarget(prev);
  renderer.autoClear = prevAutoClear;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envMap = pmrem.fromEquirectangular(rt.texture).texture;
  pmrem.dispose();
  rt.dispose();
  mat.dispose();
  quad.geometry.dispose();
  return envMap;
}

const setLighting = (
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer
) => {
  const initial = PALETTES[resolveInitialPalette()];

  const ambient = new THREE.AmbientLight(initial.lights.ambient, 0);
  scene.add(ambient);

  // Front light — keeps the face readable
  const face = new THREE.PointLight(initial.lights.fill, 0, 50, 1.6);
  face.position.set(0, 14.2, 20);
  scene.add(face);

  const key = new THREE.PointLight(initial.lights.key, 0, 45, 2);
  key.position.set(4, 15, 10);
  scene.add(key);

  const rim = new THREE.PointLight(initial.lights.rim, 0, 40, 2);
  rim.position.set(-5, 15.5, 2);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(initial.lights.fill, 0);
  fill.position.set(1, 16, 14);
  scene.add(fill);

  const under = new THREE.PointLight(initial.lights.under, 0, 30, 2);
  under.position.set(0, 11, 8);
  scene.add(under);

  const screenBounce = new THREE.PointLight(initial.lights.key, 0, 100, 3);
  screenBounce.position.set(3, 12, 4);
  scene.add(screenBounce);

  let rawHdr: THREE.Texture | null = null;
  let envMap: THREE.Texture | null = null;
  let targetEnv = initial.lights.envIntensity;
  let lightsOn = false;
  let currentTint = initial.lights.key;

  const refreshEnv = (tintHex: number) => {
    if (!rawHdr) return;
    const next = buildTintedEnv(renderer, rawHdr, tintHex);
    const prev = envMap;
    envMap = next;
    scene.environment = next;
    if (prev && prev !== next) {
      prev.dispose();
    }
    currentTint = tintHex;
  };

  const applyLights = (palette: PaletteDef) => {
    ambient.color.setHex(palette.lights.ambient);
    face.color.setHex(palette.lights.fill);
    key.color.setHex(palette.lights.key);
    rim.color.setHex(palette.lights.rim);
    fill.color.setHex(palette.lights.fill);
    under.color.setHex(palette.lights.under);
    screenBounce.color.setHex(palette.lights.key);
    targetEnv = palette.lights.envIntensity;
    // Blend key + rim for a richer reflection tint
    const tint = new THREE.Color(palette.lights.key)
      .lerp(new THREE.Color(palette.lights.rim), 0.35)
      .getHex();
    refreshEnv(tint);
    if (lightsOn) {
      scene.environmentIntensity = targetEnv;
    }
  };

  const onPaletteChange = (event: Event) => {
    const detail = (
      event as CustomEvent<{ name: PaletteName; palette: PaletteDef }>
    ).detail;
    if (detail?.palette) applyLights(detail.palette);
  };
  window.addEventListener("palettechange", onPaletteChange);

  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      rawHdr = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
      refreshEnv(currentTint);
      if (lightsOn) {
        scene.environmentIntensity = targetEnv;
      }
    });

  function setPointLight(screenLight: any) {
    if (screenLight?.material?.opacity > 0.9) {
      screenBounce.intensity = screenLight.material.emissiveIntensity * 12;
      screenBounce.color.copy(
        (screenLight.material as THREE.MeshStandardMaterial).emissive
      );
    } else {
      screenBounce.intensity = 0;
    }
  }

  const duration = 2;
  const ease = "power2.inOut";
  function turnOnLights() {
    lightsOn = true;
    gsap.to(scene, {
      environmentIntensity: targetEnv,
      duration,
      ease,
    });
    gsap.to(ambient, { intensity: 1.15, duration, ease });
    gsap.to(face, { intensity: 2.8, duration, ease });
    gsap.to(key, { intensity: 2.4, duration, ease });
    gsap.to(rim, { intensity: 1.6, duration, ease });
    gsap.to(fill, { intensity: 0.75, duration, ease });
    gsap.to(under, { intensity: 1.1, duration, ease });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 2,
    });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;
