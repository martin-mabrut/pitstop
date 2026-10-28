import { useState } from 'react';
import { type Repair } from '../../contexts/RepairsProvider';
import Modal from './modal';
import EditRepair from './editRepair';
import DeleteRepair from './deleteRepair';

interface RepairHistoryProps {
    vehicleId: string | number;
    repairs: Repair[];
    onClose: () => void;
}

function formatDate(date?: string) {
    return date ? new Date(date).toLocaleDateString('fr-FR') : '-';
}

export default function RepairHistory({ vehicleId, repairs, onClose }: RepairHistoryProps) {
    const [editing, setEditing] = useState<Repair | null>(null);
    const [deleting, setDeleting] = useState<Repair | null>(null);

    const sorted = repairs.slice().sort(function (a, b) {
        return new Date(b.repairedAt).getTime() - new Date(a.repairedAt).getTime();
    });

    return (
        <>
            <Modal title="Historique des réparations" onClose={onClose}>
                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    {sorted.length === 0 ? (
                        <p>Aucune réparation pour ce véhicule.</p>
                    ) : (
                        <ul className="list-group mb-3">
                            {sorted.map(function (repair) {
                                return (
                                    <li key={repair.id} className="list-group-item">
                                        <strong>{formatDate(repair.repairedAt)}</strong> - {repair.typeOfRepairs}
                                        <br />
                                        {repair.description} ({repair.price} €)
                                        <div className="mt-2">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-secondary"
                                                onClick={function () { setEditing(repair); }}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger ms-1"
                                                onClick={function () { setDeleting(repair); }}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
                <div className="modal-pitstop__actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Fermer</button>
                </div>
            </Modal>

            {editing && (
                <EditRepair
                    vehicleId={vehicleId}
                    repair={editing}
                    onClose={function () { setEditing(null); }}
                />
            )}

            {deleting && (
                <DeleteRepair
                    vehicleId={vehicleId}
                    repair={deleting}
                    onClose={function () { setDeleting(null); }}
                />
            )}
        </>
    );
}