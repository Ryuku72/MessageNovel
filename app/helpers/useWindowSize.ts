import { useEffect, useRef, useState } from "react";

export const enum WINDOW_SIZE {
  MOBILE_PORTAIT = "mobile-portrait",
  MOBILE_LANDSCAPE = "mobile-landscape",
  TABLET = "tablet",
  WEB = "web",
}

export type WindowSize = {
  width: number;
  height: number;
  viewport: WINDOW_SIZE;
  mobile: boolean;
};

// returns the Widnow Size
const useWindowSize = (): WindowSize => {
  // Initialize state with undefined width/height so server and client renders match
  if (typeof window === "undefined")
    return {
      width: 1920,
      height: 1080,
      viewport: WINDOW_SIZE.WEB,
      mobile: false,
    };
  const [windowSize, setWindowSize] = useState({
    width: 1920,
    height: 1080,
    viewport: WINDOW_SIZE.WEB,
    mobile: false,
  });
  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  const handleResize = (): void => {
    // Set window width/height to state
    if (throttleRef.current) clearTimeout(throttleRef.current);
    const windowView = () => {
      if (window.innerWidth <= 541) return WINDOW_SIZE.MOBILE_PORTAIT;
      else if (window.innerWidth <= 749 && window.innerWidth >= 542)
        return WINDOW_SIZE.MOBILE_LANDSCAPE;
      else if (window.innerWidth <= 1024 && window.innerWidth >= 750)
        return WINDOW_SIZE.TABLET;
      else return WINDOW_SIZE.WEB;
    };

    const update = {
      width: window.innerWidth,
      height: window.innerHeight,
      viewport: windowView(),
      mobile: window.innerWidth <= 749,
    };

    if (JSON.stringify(update) === JSON.stringify(windowSize)) return;
    throttleRef.current = setTimeout(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        viewport: windowView(),
        mobile: window.innerWidth <= 749,
      });
    }, 10);
  };

  useEffect(() => {
    // Handler to call on window resize

    // Add event listener
    window?.addEventListener("resize", handleResize);

    // Remove event listener on cleanup
    handleResize();
    return () => {
      if (throttleRef.current) clearTimeout(throttleRef.current);
      window?.removeEventListener("resize", handleResize);
    };
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
};

export default useWindowSize;
