import * as THREE from "three";
import gsap from "gsap";

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  let intensity: number = 0;
  setInterval(() => {
    intensity = Math.random();
  }, 200);

  let screenLight: any, monitor: any;
  const plane004 = character?.getObjectByName("Plane004");
  plane004?.children.forEach((child: any) => {
    child.material.transparent = true;
    child.material.opacity = 0;
    if (child.material.name === "Material.027") {
      monitor = child;
      child.material.color.set("#FFFFFF");
    }
  });
  const screenLightObj = character?.getObjectByName("screenlight") as any;
  if (screenLightObj) {
    screenLightObj.material.transparent = true;
    screenLightObj.material.opacity = 0;
    screenLightObj.material.emissive.set("#C8BFFF");
    gsap.timeline({ repeat: -1, repeatRefresh: true }).to(screenLightObj.material, {
      emissiveIntensity: () => intensity * 8,
      duration: () => Math.random() * 0.6,
      delay: () => Math.random() * 0.1,
    });
    screenLight = screenLightObj;
  }
  const deskProps = character?.getObjectByName("deskProps");
  const chairProps = character?.getObjectByName("chairProps");
  if (deskProps) {
    deskProps.scale.setScalar(0.01);
    deskProps.visible = false;
  }
  if (chairProps) {
    chairProps.visible = false;
  }
  const neckBone = character?.getObjectByName("spine005");

  if (window.innerWidth <= 1024) {
    if (character) {
      gsap.timeline({
        scrollTrigger: {
          trigger: ".what-box-in",
          start: "top 70%",
          end: "bottom top",
        },
      }).to(".what-box-in", { autoAlpha: 1, duration: 0.2 }, 0);
    }
    return;
  }

  if (!character) return;

  gsap.set(".character-model", { xPercent: 0, x: 0, y: 0 });

  // Single scrub timeline — Lenis smooths wheel input
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      endTrigger: ".whatIDO",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
    defaults: { ease: "none" },
  });

  // —— Phase 0→1: Landing → About (bust shot, no desk) ——
  tl.fromTo(character.rotation, { y: 0, x: 0 }, { y: 0.7, x: 0, duration: 1 }, 0)
    .fromTo(camera.position, { z: 24.7, y: 13.1 }, { z: 22, y: 13.1, duration: 1 }, 0)
    .fromTo(".character-model", { xPercent: 0 }, { xPercent: -25, duration: 1 }, 0)
    .to(".landing-container", { opacity: 0, duration: 0.45 }, 0)
    .to(".landing-container", { y: "40%", duration: 1 }, 0)
    .fromTo(".about-me", { y: "-50%" }, { y: "0%", duration: 1 }, 0)
    // Soften hero rim; keep corner glow (matches deployed)
    .to(".character-rim", { opacity: 0, duration: 0.5 }, 0.15)
    .to(".landing-circle2", { opacity: 0, duration: 0.5 }, 0.1);

  // —— Phase 1→2: About → Desk / What I Do ——
  tl.to(camera.position, { z: 75, y: 8.4, duration: 1 }, 1)
    .to(".about-section", { y: "30%", duration: 1 }, 1)
    .to(".about-section", { opacity: 0, duration: 0.35 }, 1.35)
    // Match deployed desk framing (~x: -12%)
    .to(".character-model", { xPercent: -12, pointerEvents: "none", duration: 1 }, 1)
    .to(character.rotation, { y: 0.92, x: 0.12, duration: 0.85 }, 1);

  if (neckBone) {
    tl.to(neckBone.rotation, { x: 0.6, duration: 0.85 }, 1);
  }

  // Desk + chair grow with the zoom — short ramp so mid-frames aren't empty hands
  if (deskProps) {
    tl.set(deskProps, { visible: true }, 1)
      .fromTo(
        deskProps.scale,
        { x: 0.01, y: 0.01, z: 0.01 },
        { x: 1, y: 1, z: 1, duration: 0.35 },
        1.02
      );
  }
  if (chairProps) {
    tl.set(chairProps, { visible: true }, 1);
  }
  if (monitor) {
    tl.fromTo(
      monitor.position,
      { y: -10, z: 2 },
      { y: 0, z: 0, duration: 0.35 },
      1.05
    );
  }
  if (monitor?.material) {
    tl.to(monitor.material, { opacity: 1, duration: 0.28 }, 1.08);
  }
  if (screenLight?.material) {
    tl.to(screenLight.material, { opacity: 1, duration: 0.28 }, 1.15);
  }

  tl.to(
    ".character-rim",
    { opacity: 0, scale: 0, y: "-70%", duration: 0.5 },
    1
  )
    .fromTo(
      ".what-box-in",
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.25 },
      1.55
    );

  // —— Phase 2→3: Leave What I Do ——
  tl.to(".character-model", { y: "-100%", duration: 1 }, 2)
    .to(".whatIDO", { y: "15%", duration: 1 }, 2)
    .to(character.rotation, { x: -0.04, duration: 0.8 }, 2);
}

export function setAllTimeline() {
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 50%",
      end: "bottom 30%",
      scrub: true,
      invalidateOnRefresh: true,
    },
    defaults: { ease: "none" },
  });
  careerTimeline
    .fromTo(
      ".career-timeline",
      { maxHeight: "0%" },
      { maxHeight: "100%", duration: 1 },
      0
    )
    .fromTo(".career-timeline", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
    .fromTo(
      ".career-info-box",
      { opacity: 0 },
      { opacity: 1, stagger: 0.1, duration: 0.5 },
      0
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      {
        animationIterationCount: "1",
        delay: 0.3,
        duration: 0.1,
      },
      0
    );

  if (window.innerWidth > 1024) {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: "20%", duration: 0.5, delay: 0.2 },
      0
    );
  } else {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: 0, duration: 0.5, delay: 0.2 },
      0
    );
  }
}
