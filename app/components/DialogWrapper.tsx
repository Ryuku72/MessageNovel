import { useEffect, useRef } from 'react';

export type DialogWrapperProps = {
  open: boolean;
  className?: string;
  children: React.ReactNode;
  dataTestId?: string;
  handleClickOutside?: (e: React.SyntheticEvent) => void;
};

export default function DialogWrapper({
  open,
  className = '',
  children,
  handleClickOutside = () => {},
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
    <dialog ref={modalRef} className={className} onKeyUp={e => {
     if (e.key === 'Escape') handleClickOutside(e);
    }}>
      {children}
    </dialog>
  );
}
