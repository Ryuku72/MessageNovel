import { useEffect, useRef } from 'react';

export type DialogWrapperProps = {
  open: boolean;
  children: React.ReactNode;
  dataTestId?: string;
  handleClickOutside?: (e: React.SyntheticEvent) => void;
  animate?: boolean;
};

export default function DialogWrapper({
  open,
  children,
  animate = true,
  handleClickOutside = () => {}
}: DialogWrapperProps) {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const modal = modalRef?.current;
    return () => {
      if (modal?.open) modal.close();
    };
  }, []);

  useEffect(() => {
    const modal = modalRef?.current;
    if (!modal || modal.open === open) return;
    if (open) modal.showModal();
    else modal.close();
  }, [open]);

  return (
    <dialog
      ref={modalRef}
      className={`max-w-full max-h-full w-full h-full justify-center md:p-[36px] p-4 bg-transparent ${animate ? 'jiggle bg-black bg-opacity-30 z-10' : 'z-10'}`}
      onKeyUp={e => {
        if (e.key === 'Escape') handleClickOutside(e);
      }}>
      {children}
    </dialog>
  );
}
