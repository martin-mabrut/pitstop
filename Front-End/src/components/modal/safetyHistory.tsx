import Modal from './modal';

interface SafetyInspection {
    id: string | number;
    type?: string;
    dueTime?: string;
    isDone?: string | null;
}

interface SafetyHistoryProps {
    inspections: SafetyInspection[];
    onClose: () => void;
}

function formatDate(date?: string | null) {
    return date ? new Date(date).toLocaleDateString('fr-FR') : '-';
}

export default function SafetyHistory({ inspections, onClose }: SafetyHistoryProps) {

    // sécurité : si le provider ne renvoie pas un tableau, on affiche une liste vide
    const list = Array.isArray(inspections) ? inspections : [];

    // copie triée, échéance la plus récente d'abord
    const sorted = list.slice().sort(function (a, b) {
        return new Date(b.dueTime ?? 0).getTime() - new Date(a.dueTime ?? 0).getTime();
    });

    return (
        <Modal title="Historique des contrôles techniques" onClose={onClose}>
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {sorted.length === 0 ? (
                    <p>Aucun contrôle pour ce véhicule.</p>
                ) : (
                    <ul className="list-group mb-3">
                        {sorted.map(function (ct) {
                            return (
                                <li key={ct.id} className="list-group-item">
                                    <strong>{formatDate(ct.dueTime)}</strong> - {ct.type}
                                    <br />
                                    {ct.isDone ? 'Réalisé le ' + formatDate(ct.isDone) : 'Non réalisé'}
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
    );
}