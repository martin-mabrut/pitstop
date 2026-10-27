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
                <label>
                    <p>Marque</p>
                    <input name="brand" defaultValue={vehicle.brand} required />
                </label>
                <label>
                    <p>Modèle</p>
                    <input name="model" defaultValue={vehicle.model} required />
                </label>
                <br />
                <button type="submit">Enregistrer</button>
                <button type="button" onClick={onClose}>Annuler</button>
            </form>
        </Modal>
    );
}