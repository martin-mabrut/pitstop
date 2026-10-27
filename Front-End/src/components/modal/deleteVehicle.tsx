import { useVehicle, type Vehicle } from '../../contexts/VehicleProvider';
import Modal from './modal';


interface DeleteVehicleProps {
    vehicle: Vehicle;
    onClose: () => void;
}

export default function DeleteVehicle({ vehicle, onClose }: DeleteVehicleProps) {
    const { deleteVehicle } = useVehicle();

    async function handleDelete() {
        await deleteVehicle(vehicle.id);
        onClose();
    }

    return (
        <Modal title="Supprimer le véhicule" onClose={onClose}>
            <p>
                Supprimer {vehicle.brand} {vehicle.model} ?
            </p>
            <button onClick={handleDelete}>Oui, supprimer</button>
            <button onClick={onClose}>Annuler</button>
        </Modal>
    );
}