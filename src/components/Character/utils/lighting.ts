import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";
import {
  DEFAULT_PALETTE,
  PALETTES,
  type PaletteDef,
  type PaletteName,
} from "../../../palettes";

const setLighting = (scene: THREE.Scene) => {
  const initial = PALETTES[DEFAULT_PALETTE];
  const directionalLight = new THREE.DirectionalLight(
    initial.lights.directional,
    0
  );
  directionalLight.intensity = 0;
  directionalLight.position.set(-0.47, -0.32, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(initial.lights.point, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = true;
  scene.add(pointLight);

  const applyLights = (palette: PaletteDef) => {
    directionalLight.color.setHex(palette.lights.directional);
    pointLight.color.setHex(palette.lights.point);
  };

  const onPaletteChange = (event: Event) => {
    const detail = (event as CustomEvent<{ name: PaletteName; palette: PaletteDef }>)
      .detail;
    if (detail?.palette) applyLights(detail.palette);
  };
  window.addEventListener("palettechange", onPaletteChange);

  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

  function setPointLight(screenLight: any) {
    if (screenLight.material.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 20;
    } else {
      pointLight.intensity = 0;
    }
  }
  const duration = 2;
  const ease = "power2.inOut";
  function turnOnLights() {
    gsap.to(scene, {
      environmentIntensity: 0.64,
      duration: duration,
      ease: ease,
    });
    gsap.to(directionalLight, {
      intensity: 1,
      duration: duration,
      ease: ease,
    });
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
