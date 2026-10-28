import { useRepairs } from '../../contexts/RepairsProvider';
import { useVehicle } from '../../contexts/VehicleProvider';
import Modal from './modal';

interface AddRepairProps {
    vehicleId?: string | number;
    onClose: () => void;
}

export default function AddRepair({ vehicleId, onClose }: AddRepairProps) {
    const { addRepair } = useRepairs();
    const { vehicles } = useVehicle();

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        const selectedId = vehicleId ?? (form.get('vehicleId') as string);

        await addRepair(selectedId, {
            typeOfRepairs: form.get('typeOfRepairs') as string,
            repairedAt: form.get('repairedAt') as string,
            description: form.get('description') as string,
            price: Number(form.get('price')),
        });
        onClose();
    }

    return (
        <Modal title="Ajouter une réparation" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                {vehicleId === undefined && (
                    <label className="form-label w-100 mb-3">
                        Véhicule
                        <select name="vehicleId" className="form-select mt-1" required defaultValue="">
                            <option value="" disabled>Choisir un véhicule</option>
                            {vehicles.map(function (v) {
                                return (
                                    <option key={v.id} value={v.id}>
                                        {v.brand} {v.model}
                                    </option>
                                );
                            })}
                        </select>
                    </label>
                )}
                <label className="form-label w-100 mb-3">
                    Type de réparation
                    <select name="typeOfRepairs" className="form-select mt-1" required>
                        <option value="Carrosserie">Carrosserie</option>
                        <option value="Mécaniques">Mécanique</option>
                        <option value="Electriques">Électrique</option>
                        <option value="Peinture">Peinture</option>
                        <option value="Autre">Autre</option>
                    </select>
                </label>
                <label className="form-label w-100 mb-3">
                    Date de la réparation
                    <input name="repairedAt" type="date" className="form-control mt-1" required />
                </label>
                <label className="form-label w-100 mb-3">
                    Description
                    <input name="description" className="form-control mt-1" maxLength={200} />
                </label>
                <label className="form-label w-100 mb-3">
                    Prix (€)
                    <input name="price" type="number" step="0.01" min="0" className="form-control mt-1" required />
                </label>
                <div className="modal-pitstop__actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
                    <button type="submit" className="btn btn-success">Ajouter</button>
                </div>
            </form>
        </Modal>
    );
}