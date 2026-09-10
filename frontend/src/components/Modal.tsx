import { useEffect } from "react";
import type { ReactNode } from "react";
import Icon from "./Icon";

type Props = { title: string; children: ReactNode; onClose: () => void };

export default function Modal({ title, children, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal" onMouseDown={onClose}>
      <div className="modal-box" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fechar"><Icon name="cross" /></button>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
