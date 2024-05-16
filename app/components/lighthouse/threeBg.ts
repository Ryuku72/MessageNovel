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
import { GLTFLoader, RoomEnvironment } from 'three/examples/jsm/Addons.js';

export default function threeBg() {
  return () => {
    const animateRef = useRef(0);

    useEffect(() => {
      let mixer: AnimationMixer;
      const clock = new Clock();

      const renderer = new WebGLRenderer({
        canvas: document.querySelector('#canvas-bg') as HTMLCanvasElement
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

      const loader = new GLTFLoader();
      loader.setPath('app/components/lighthouse/models/');
      loader.load(
        'medieval_fantasy_book.glb',
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
        Gsap.to(camera.position, { duration: 5, x: 16, y: 6, z: 50 });
        Gsap.to(camera.rotation, { duration: 5, x: 0.05, y: 0.8, z: -0.015 });
      };

      const sceneTwo = () => {
        Gsap.to(camera.position, { duration: 3, x: 12, y: 2.5, z: -22 });
        Gsap.to(camera.rotation, { duration: 3, x: 0.05, y: 2.25, z: -0.015 });
      };

      const sceneAnimate = (event: Event) => {
        if ('detail' in event) {
          switch (event.detail) {
            case 1:
              return sceneOne();
            case 2:
              return sceneTwo();
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
  };
}
