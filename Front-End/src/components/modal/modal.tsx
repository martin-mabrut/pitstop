import type { ReactNode } from 'react';
import './modal.css';

interface ModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
    return (
        <div className="modal-pitstop" onClick={onClose}>
            <div
                className="modal-pitstop__box"
                onClick={function (e) { e.stopPropagation(); }}
            >
                <h2 className="modal-pitstop__title">{title}</h2>
                {children}
            </div>
        </div>
    );
}
