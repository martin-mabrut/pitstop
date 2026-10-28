import { useRepairs, type Repair } from '../../contexts/RepairsProvider';
import Modal from './modal';

interface EditRepairProps {
    vehicleId: string | number;
    repair: Repair;
    onClose: () => void;
}

export default function EditRepair({ vehicleId, repair, onClose }: EditRepairProps) {
    const { modifyRepair } = useRepairs();

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        await modifyRepair(vehicleId, repair.id, {
            typeOfRepairs: form.get('typeOfRepairs') as string,
            repairedAt: form.get('repairedAt') as string,
            description: form.get('description') as string,
            price: Number(form.get('price')),
        });
        onClose();
    }

    return (
        <Modal title="Modifier la réparation" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <label className="form-label w-100 mb-3">
                    Type de réparation
                    <select name="typeOfRepairs" defaultValue={repair.typeOfRepairs} className="form-select mt-1" required>
                        <option value="Carrosserie">Carrosserie</option>
                        <option value="Mécaniques">Mécanique</option>
                        <option value="Electriques">Électrique</option>
                        <option value="Peinture">Peinture</option>
                        <option value="Autre">Autre</option>
                    </select>
                </label>
                <label className="form-label w-100 mb-3">
                    Date de la réparation
                    <input name="repairedAt" type="date" defaultValue={repair.repairedAt?.slice(0, 10)} className="form-control mt-1" required />
                </label>
                <label className="form-label w-100 mb-3">
                    Description
                    <input name="description" defaultValue={repair.description} className="form-control mt-1" maxLength={200} />
                </label>
                <label className="form-label w-100 mb-3">
                    Prix (€)
                    <input name="price" type="number" step="0.01" min="0" defaultValue={repair.price} className="form-control mt-1" required />
                </label>
                <div className="modal-pitstop__actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                </div>
            </form>
        </Modal>
    );
}