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
            vehicleType: form.get('vehicleType') as string,
            registrationNumber: form.get('registrationNumber') as string,
            brand: form.get('brand') as string,
            model: form.get('model') as string,
            version: form.get('version') as string,
            firstRegistrationDate: form.get('firstRegistrationDate') as string,
            typeOfFuel: form.get('typeOfFuel') as string,
            typeOfTransmission: form.get('typeOfTransmission') as string,
            mileage: Number(form.get('mileage')),
            kmPerDay: Number(form.get('kmPerDay')),
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