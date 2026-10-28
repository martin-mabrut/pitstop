import Modal from './modal';
import { type SafetyInspection } from '../CardSafetyInspection/CardSafetyInspection';
import './repairHistory.css';

interface SafetyHistoryProps {
    inspections: SafetyInspection[];
    onClose: () => void;
}

const TYPE_LABELS: Record<string, string> = {
    regular: 'Périodique',
    followUp: 'Contre-visite',
};

function formatDate(date?: string | null) {
    return date ? new Date(date).toLocaleDateString('fr-FR') : '-';
}

export default function SafetyHistory({ inspections, onClose }: SafetyHistoryProps) {

    // sécurité : si le provider ne renvoie pas un tableau, on affiche une liste vide
    const list = Array.isArray(inspections) ? inspections : [];

    // copie triée, échéance la plus récente d'abord
    const sorted = list.slice().sort(function (a, b) {
        return new Date(b.dueTimeAt).getTime() - new Date(a.dueTimeAt).getTime();
    });

    return (
        <Modal title="Historique des contrôles techniques" onClose={onClose}>
            {sorted.length === 0 ? (
                <p className="repair-history__empty">Aucun contrôle pour ce véhicule.</p>
            ) : (
                <ul className="repair-history">
                    {sorted.map(function (ct) {
                        return (
                            <li key={ct.id} className="repair-history__item">
                                <div className="repair-history__header">
                                    <span className="repair-history__date">
                                        {ct.doneAt ? 'Réalisé le ' + formatDate(ct.doneAt) : 'Échéance : ' + formatDate(ct.dueTimeAt)}
                                    </span>
                                    <span className="repair-history__price">
                                        {ct.doneAt ? 'Réalisé' : 'À venir'}
                                    </span>
                                </div>
                                <span className="repair-history__badge">{TYPE_LABELS[ct.type] ?? ct.type}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
            <div className="modal-pitstop__actions">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Fermer</button>
            </div>
        </Modal>
    );
}
