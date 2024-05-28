import { useEffect, useRef } from 'react';

import Gsap from 'gsap';
import {
  ACESFilmicToneMapping,
  AnimationMixer,
  Clock,
  Color,
  PMREMGenerator,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three';
import { DRACOLoader, GLTFLoader, RoomEnvironment } from 'three/examples/jsm/Addons.js';
import gltfModal from '~/assets/model.glb';

export default function ThreeJsBackground() {
  const animateRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let mixer: AnimationMixer;
    const clock = new Clock();

    const renderer = new WebGLRenderer({
      canvas: canvasRef.current as HTMLCanvasElement
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

    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(-1, 80, 30);
    camera.rotation.set(0.05, 1.2, -0.015);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://threejs.org/examples/js/libs/draco/gltf/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      gltfModal,
      gltf => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        scene.add(model);
        mixer = new AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();

        animateRef.current = requestAnimationFrame(animate);
      },
      xhr => {
        if (!xhr.total) {
          const sceneEvent = new CustomEvent('scene ready', {
            detail: 100
          });
  
          return window.dispatchEvent(sceneEvent);
        }
        const sceneEvent = new CustomEvent('scene ready', {
          detail: (xhr.loaded / xhr.total) * 100
        });

        window.dispatchEvent(sceneEvent);
      },
      e => {
        // eslint-disable-next-line no-console
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
      Gsap.to(camera.position, { duration: 3, x: 16, y: 6, z: 50 });
      Gsap.to(camera.rotation, { duration: 3, x: 0.05, y: 0.7, z: -0.015 });
    };

    const sceneTwo = () => {
      Gsap.to(camera.position, { duration: 3, x: -18, y: 0, z: 24 });
      Gsap.to(camera.rotation, { duration: 3, x: 0.25, y: 0.3, z: -0.015 });
    };

    const sceneThree = () => {
      Gsap.to(camera.position, { duration: 3, x: 26, y: 1, z: 24.5 });
      Gsap.to(camera.rotation, { duration: 3, x: -0.05, y: 0.65, z: -0.2 });
    };

    const sceneFour = () => {
      Gsap.to(camera.position, { duration: 3, x: 12, y: 3, z: -24 });
      Gsap.to(camera.rotation, { duration: 3, x: 0, y: 2, z: 0 });
    };

    const sceneFive = () => {
      Gsap.to(camera.position, { duration: 3, x: -7, y: -0.1, z: 28.5 });
      Gsap.to(camera.rotation, { duration: 3, x: -0.15, y: -0.7, z: -0.015 });
    };

    const sceneAnimate = (event: Event) => {
      if ('detail' in event) {
        // eslint-disable-next-line no-console
        console.log(event?.detail);
        switch (event.detail) {
          case 1:
            return sceneOne();
          case 2:
            return sceneTwo();
          case 3:
            return sceneThree();
          case 4:
            return sceneFour();
          case 5:
            return sceneFive();
        }
      }
    };

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('sceneUpdate', sceneAnimate, false);
    return () => {
      cancelAnimationFrame(animateRef.current);
      window.removeEventListener('resize', onWindowResize, false);
      window.removeEventListener('sceneUpdate', sceneAnimate, false);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />;
}
