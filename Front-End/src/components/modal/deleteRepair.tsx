import { useRepairs, type Repair } from '../../contexts/RepairsProvider';
import Modal from './modal';

interface DeleteRepairProps {
    vehicleId: string | number;
    repair: Repair;
    onClose: () => void;
}

export default function DeleteRepair({ vehicleId, repair, onClose }: DeleteRepairProps) {
    const { deleteRepair } = useRepairs();

    async function handleDelete() {
        await deleteRepair(vehicleId, repair.id);
        onClose();
    }

    return (
        <Modal title="Supprimer la réparation" onClose={onClose}>
            <p>Supprimer la réparation « {repair.typeOfRepairs} » ?</p>
            <div className="modal-pitstop__actions">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Oui, supprimer</button>
            </div>
        </Modal>
    );
}