import { useState, type FormEvent } from 'react';
import { useSafety } from '../../contexts/SafetyInspectionProvider';
import type { SafetyInspection } from '../CardSafetyInspection/CardSafetyInspection';
import Modal from './modal';

interface Props {
    vehicleId: string;
    inspection: SafetyInspection;
    onClose: () => void;
}

export default function ValidSafetyInspection({ vehicleId, inspection, onClose }: Props) {
    const { validateSafetyInspections } = useSafety();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');

        const form = new FormData(event.currentTarget);

        setLoading(true);

        const success = await validateSafetyInspections(
            vehicleId,
            String(inspection.id),
            {
                doneAt: form.get('doneAt') as string,
                valid: form.get('valid') === 'yes',
            }
        );

        setLoading(false);

        if (!success) {
            setError('Validation impossible.');
            return;
        }

        onClose();
    }

    return (
        <Modal title="Valider le contrôle technique" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <label className="form-label w-100 mb-3">
                    Date de visite
                    <input type="date" name="doneAt" className="form-control mt-1" required />
                </label>

                <p className="mb-1">Le contrôle était-il favorable ?</p>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="valid" id="valid-yes" value="yes" required />
                    <label className="form-check-label" htmlFor="valid-yes">Oui</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="valid" id="valid-no" value="no" />
                    <label className="form-check-label" htmlFor="valid-no">Non (contre-visite)</label>
                </div>

                {error && <p className="text-danger mt-3 mb-0">{error}</p>}

                <div className="modal-pitstop__actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                        Annuler
                    </button>
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? 'Validation...' : 'Valider'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
