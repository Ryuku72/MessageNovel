import { useEffect, useRef, useState } from 'react';

export function ToastAlert() {
  const [alertString, setAlertString] = useState('I am an Alert');
  const [showAlert, setShowAlert] = useState(false);
  const init = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.addEventListener('alertFromError', handleAlert);
    init.current = true;

    return () => {
      window.addEventListener('alertFromError', handleAlert);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleAlert = (event: Event) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowAlert(false);
    setAlertString('');
    if ('detail' in event && typeof event.detail === 'string') {
      setAlertString(event.detail);
      setShowAlert(true);
      timerRef.current = setTimeout(() => init.current && setShowAlert(false), 3500);
    }
  };

  const handleClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowAlert(false);
  };

  return (
    <div className="w-full fixed bottom-0 flex justify-center">
      <button
        className={`absolute ease-in bg-black bg-opacity-35 rounded-lg backdrop-blur-m min-w-28 text-center transition-all bottom-10 cursor-pointer ${
          showAlert ? 'px-6 py-2 opacity-100 md:bottom-10 bottom-[100px] pointer-events-auto' : 'opacity-0 -bottom-8 pointer-events-none'
        }`}
        type="button"
        onClick={handleClick}>
        <p className="text-white text-sm">{alertString}</p>
      </button>
    </div>
  );
}
