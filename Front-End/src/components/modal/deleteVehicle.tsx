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
            <div className="modal-pitstop__actions">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Oui, supprimer</button>
            </div>
        </Modal>
    );
}