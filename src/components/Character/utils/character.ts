import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { buildRobot, type RobotInstance } from "./buildRobot";

let robotRef: RobotInstance | null = null;

export const getRobot = () => robotRef;

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const robot = buildRobot();
        robotRef = robot;
        const character = robot.character;

        // Cap compile wait so the loader doesn't hang on shader warmup
        await Promise.race([
          renderer.compileAsync(character, camera, scene),
          new Promise<void>((r) => setTimeout(r, 600)),
        ]);

        character.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
            child.frustumCulled = true;
          }
        });

        // Minimal GLTF-shaped object so existing Scene/animation wiring stays intact
        const gltf = {
          scene: character,
          scenes: [character],
          animations: [] as THREE.AnimationClip[],
          cameras: [],
          asset: {},
          parser: {},
          userData: {},
        } as unknown as GLTF;

        setCharTimeline(character, camera);
        setAllTimeline();
        resolve(gltf);
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
