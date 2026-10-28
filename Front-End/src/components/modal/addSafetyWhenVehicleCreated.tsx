import { useState } from 'react';
import { type Vehicle } from '../../contexts/VehicleProvider';
import { useSafety } from '../../contexts/SafetyInspectionProvider';
import Modal from './modal';

interface AddSafetyWhenVehicleCreatedProps {
    vehicle: Vehicle;
    onClose: () => void;
}

export default function AddSafetyWhenVehicleCreated({ vehicle, onClose }: AddSafetyWhenVehicleCreatedProps) {
    const { safetyInspectionYes, safetyInspectionNo } = useSafety();
    const [isDone, setIsDone] = useState<boolean | null>(null);

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        if (isDone) {
            await safetyInspectionYes(vehicle.id, form.get('doneAt') as string);
        } else {
            await safetyInspectionNo(vehicle.id);
        }
        onClose();
    }

    return (
        <Modal title="Contrôle technique" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <p>Avez-vous réalisé un contrôle technique ?</p>

                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="isDone"
                        id="isDone-yes"
                        onChange={() => setIsDone(true)}
                        required
                    />
                    <label className="form-check-label" htmlFor="isDone-yes">Oui</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="isDone"
                        id="isDone-no"
                        onChange={() => setIsDone(false)}
                    />
                    <label className="form-check-label" htmlFor="isDone-no">Non</label>
                </div>

                {isDone && (
                    <label className="form-label w-100 mt-3">
                        Date du dernier contrôle
                        <input type="date" name="doneAt" className="form-control mt-1" required />
                    </label>
                )}

                <div className="modal-pitstop__actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
                    <button type="submit" className="btn btn-success">Valider</button>
                </div>
            </form>
        </Modal>
    );
}
