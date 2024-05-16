import { useEffect, useRef, useState } from 'react';

export function ToastAlert() {
  const [alertString, setAlertString] = useState('I am an Alert');
  const [showAlert, setShowAlert] = useState(false);
  const init = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.addEventListener('alert from error', handleAlert);
    init.current = true;

    return () => {
      window.addEventListener('alert from error', handleAlert);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleAlert = (event: Event) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if ('detail' in event && typeof event.detail === 'string') {
      setAlertString(event.detail);
      setShowAlert(true);
      timerRef.current = setTimeout(() => init.current && setShowAlert(false), 3500);
    } else setShowAlert(false);
  };

  const handleClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowAlert(false);
  };

  return (
    <div className="w-full relative flex justify-center">
      <button
        className={`absolute ease-in bg-black bg-opacity-35 rounded-lg backdrop-blur-m min-w-28 text-center transition-all bottom-10 cursor-pointer ${
          showAlert ? 'px-6 py-2 opacity-100 bottom-10' : 'opacity-0 bottom-8'
        }`}
        onClick={handleClick}>
        <p className="text-white text-sm">{alertString}</p>
      </button>
    </div>
  );
}
