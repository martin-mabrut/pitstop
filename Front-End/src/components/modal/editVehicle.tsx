import { useVehicle, type Vehicle } from '../../contexts/VehicleProvider';
import Modal from './modal';


interface EditVehicleProps {
    vehicle: Vehicle;
    onClose: () => void;
}

export default function EditVehicle({ vehicle, onClose }: EditVehicleProps) {
    const { updateVehicle } = useVehicle();

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        await updateVehicle(vehicle.id, {
            brand: form.get('brand') as string,
            model: form.get('model') as string,
        });
        onClose();
    }

    return (
        <Modal title="Modifier le véhicule" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <label className="form-label w-100 mb-3">
                    Marque
                    <input name="brand" className="form-control mt-1" defaultValue={vehicle.brand} required />
                </label>
                <label className="form-label w-100">
                    Modèle
                    <input name="model" className="form-control mt-1" defaultValue={vehicle.model} required />
                </label>
                <div className="modal-pitstop__actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                </div>
            </form>
        </Modal>
    );
}