import { useState } from 'react';
import { type Repair } from '../../contexts/RepairsProvider';
import Modal from './modal';
import './repairHistory.css';
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
                {sorted.length === 0 ? (
                    <p className="repair-history__empty">Aucune réparation pour ce véhicule.</p>
                ) : (
                    <ul className="repair-history">
                        {sorted.map(function (repair) {
                            return (
                                <li key={repair.id} className="repair-history__item">
                                    <div className="repair-history__header">
                                        <span className="repair-history__date">{formatDate(repair.repairedAt)}</span>
                                        <span className="repair-history__price">
                                            {repair.price != null ? `${repair.price.toLocaleString('fr-FR')} €` : '-'}
                                        </span>
                                    </div>
                                    <span className="repair-history__badge">{repair.typeOfRepairs}</span>
                                    {repair.description && (
                                        <p className="repair-history__description">{repair.description}</p>
                                    )}
                                    <div className="repair-history__actions">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-secondary"
                                            onClick={function () { setEditing(repair); }}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
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