import { useEffect, useRef, useState } from 'react';

import Gsap from 'gsap';

export default function LoadingLayer() {
  const [percent, setPercent] = useState(1);
  const [ready, setReady] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleSceneReady = (event: Event) => {
      if ('detail' in event && typeof event.detail === 'number') {
        const results = Math.round(event.detail);
        setPercent(results);
        Gsap.to(barRef.current, { duration: 1, width: results + '%' });
        if (results === 100) setTimeout(() => setReady(true), 1000);
      }
    };
    window.addEventListener('scene ready', handleSceneReady, false);

    return () => {
      window.removeEventListener('scene ready', handleSceneReady, false);
    };
  }, []);

  return (
    <div
      className={
        ready
          ? 'hidden'
          : 'flex items-center justify-center w-full h-full fixed top-0 left-0 z-10 pointer-events-none [background:_#bfe3dd] bg-opacity-75'
      }>
      <div className="flex items-center justify-center flex-col gap-2 w-card-l py-4 [max-width:_90%] font-mon text-center px-4 rounded text-white text-2xl text-mono">
        Loading
        <div className="bg-gray-400 backdrop-blur-sm bg-opacity-50 w-full rounded-xl shadow-sm overflow-hidden p-1">
          <div className="relative h-6 flex items-center justify-center">
            <div
              ref={barRef}
              className="absolute top-0 bottom-0 left-0 rounded-lg bg-emerald-500 backdrop-blur-sm bg-opacity-65 transition-width duration-450 ease-in-out delay-450"></div>
            <div className="relative text-white font-mono font-semibold text-sm">{percent}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
