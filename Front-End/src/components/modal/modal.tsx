import { ReactNode } from 'react';

interface ModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div
                onClick={function (e) { e.stopPropagation(); }}
                style={{
                    background: 'white',
                    color: 'black',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    minWidth: '300px',
                }}
            >
                <h2>{title}</h2>
                {children}
            </div>
        </div>
    );
}