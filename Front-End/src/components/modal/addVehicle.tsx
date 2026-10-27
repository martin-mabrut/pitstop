import { useVehicle } from '../../contexts/VehicleProvider';
import Modal from './modal';

interface AddVehicleProps {
    onClose: () => void;
}

export default function AddVehicle({ onClose }: AddVehicleProps) {
    const { addVehicle } = useVehicle();

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        await addVehicle({
            brand: form.get('brand') as string,
            model: form.get('model') as string,
        });
        onClose();
    }

    return (
        <Modal title="Ajouter un véhicule" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Marque</p>
                    <input name="brand" required />
                </label>
                <label>
                    <p>Modèle</p>
                    <input name="model" required />
                </label>
                <br />
                <button type="submit">Ajouter</button>
                <button type="button" onClick={onClose}>Annuler</button>
            </form>
        </Modal>
    );
}