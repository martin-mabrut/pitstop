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
                <label className="form-label w-100 mb-3">
                    Marque
                    <input name="brand" className="form-control mt-1" required />
                </label>
                <label className="form-label w-100">
                    Modèle
                    <input name="model" className="form-control mt-1" required />
                </label>
                <div className="modal-pitstop__actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
                    <button type="submit" className="btn btn-success">Ajouter</button>
                </div>
            </form>
        </Modal>
    );
}