import { useState, type FormEvent } from 'react';
import { useSafety } from '../../contexts/SafetyInspectionProvider';
import type { SafetyInspection } from '../CardSafetyInspection/CardSafetyInspection';
import Modal from './modal';

interface Props {
    vehicleId: string;
    inspection: SafetyInspection;
    onClose: () => void;
}

function toInputDate(value?: string | null): string {
    if (!value) return '';

    // Gère les dates ISO, y compris celles terminées par Z.
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

    return match ? `${match[1]}-${match[2]}-${match[3]}` : '';
}

export default function EditSafetyInspection({ vehicleId, inspection, onClose }: Props) {
    const { updateSafetyInspections } = useSafety();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Contrôle déjà réalisé : on modifie la visite. Sinon : l'échéance.
    const isDone = Boolean(inspection.doneAt);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');

        const form = new FormData(event.currentTarget);

        setLoading(true);

        const success = await updateSafetyInspections(
            vehicleId,
            String(inspection.id),
            isDone
                ? {
                    doneAt: form.get('doneAt') as string,
                    type: inspection.type,
                    valid: form.get('valid') === 'yes',
                }
                : {
                    dueTimeAt: form.get('dueTimeAt') as string,
                    type: inspection.type,
                }
        );

        setLoading(false);

        if (!success) {
            setError('Modification impossible.');
            return;
        }

        onClose();
    }

    return (
        <Modal title="Modifier le contrôle technique" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                {isDone ? (
                    <>
                        <label className="form-label w-100 mb-3">
                            Date de visite
                            <input
                                type="date"
                                name="doneAt"
                                defaultValue={toInputDate(inspection.doneAt)}
                                className="form-control mt-1"
                                required
                            />
                        </label>

                        <p className="mb-1">Le contrôle était-il favorable ?</p>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="valid" id="edit-valid-yes" value="yes" required />
                            <label className="form-check-label" htmlFor="edit-valid-yes">Oui</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="valid" id="edit-valid-no" value="no" />
                            <label className="form-check-label" htmlFor="edit-valid-no">Non (contre-visite)</label>
                        </div>
                    </>
                ) : (
                    <label className="form-label w-100">
                        Date d'échéance
                        <input
                            type="date"
                            name="dueTimeAt"
                            defaultValue={toInputDate(inspection.dueTimeAt)}
                            className="form-control mt-1"
                            required
                        />
                    </label>
                )}

                {error && <p className="text-danger mt-3 mb-0">{error}</p>}

                <div className="modal-pitstop__actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                        Annuler
                    </button>
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
