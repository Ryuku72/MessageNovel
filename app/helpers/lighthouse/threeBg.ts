import { useEffect, useRef } from "react";
import {
  GLTFLoader,
  RoomEnvironment,
} from "three/examples/jsm/Addons.js";
import { ACESFilmicToneMapping, AnimationMixer, Clock, Color, PerspectiveCamera, PMREMGenerator, Scene, WebGLRenderer } from "three";
import gsap from "gsap";

export default function threeBg() {
  const animateRef = useRef(0);

  useEffect(() => {
    let mixer: AnimationMixer;
    const clock = new Clock();

    const renderer = new WebGLRenderer({
      canvas: document.querySelector("#canvas-bg") as HTMLCanvasElement,
    });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new Scene();
    const environment = new RoomEnvironment(renderer);
    const pmremGenerator = new PMREMGenerator(renderer);

    scene.background = new Color(0xbfe3dd);
    scene.environment = pmremGenerator.fromScene(environment).texture;

    const camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(-1, 30, 30);
    camera.rotation.set(0.05, 1.2, -0.015);

    const loader = new GLTFLoader();
    loader.setPath("app/helpers/lighthouse/models/");
    loader.load(
      "medieval_fantasy_book.glb",
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0 , 0)
        model.scale.set(1, 1, 1);
        scene.add(model);
        mixer = new AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();

        animate();
      },
      (xhr) => {
        const percent = (xhr.loaded / xhr.total) * 100;
        console.log(percent + "% loaded");
        if (percent === 100) {
          const sceneEvent = new CustomEvent("scene ready", {
            detail: true,
          });
          window.dispatchEvent(sceneEvent);
        }
      },
      (e) => {
        console.error(e);
      }
    );

    const animate = () => {
      animateRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      mixer.update(delta);
      renderer.render(scene, camera);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const sceneOne = () => {
      gsap.to(camera.position, { duration: 3, x: 16, y: 6, z: 50 });
      gsap.to(camera.rotation, { duration: 3, x: 0.05, y: 0.8, z: -0.015 });
    }

    const sceneTwo = () => {
      gsap.to(camera.position, { duration: 3, x: 12, y: 2.5, z: -22 });
      gsap.to(camera.rotation, { duration: 3, x: 0.05, y: 2.25, z: -0.015 });
    }

    const sceneAnimate = (event: Event) => {
      console.log(event);
      if ('detail' in event) {
        switch (event.detail) {
          case 1: return sceneOne();
          case 2: return sceneTwo();
        }
      }
    }

    window.addEventListener("resize", onWindowResize, false);
    window.addEventListener("sceneUpdate", sceneAnimate, false);
    return () => {
      cancelAnimationFrame(animateRef.current);
      window.removeEventListener("resize", onWindowResize, false);
      window.removeEventListener("sceneUpdate", sceneAnimate, false);
    };
  }, []);
}
