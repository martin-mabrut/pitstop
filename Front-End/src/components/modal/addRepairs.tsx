import { useRepairs } from '../../contexts/RepairsProvider';
import Modal from './modal';

interface AddRepairProps {
    onClose: () => void;
}

export default function AddRepair({ onClose }: AddRepairProps) {
    const { addRepair } = useRepairs();

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        await addRepair({
            typeOfRepairs: form.get('type of repairs') as string,
            repairDate: form.get('repair date') as string,
        });
        onClose();
    }

    return (
        <Modal title="Ajouter une réparation" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <label className="form-label w-100 mb-3">
                    Type de réparation
                    <input name="brand" className="form-control mt-1" required />
                </label>
                <label className="form-label w-100">
                    Date de la réparation
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