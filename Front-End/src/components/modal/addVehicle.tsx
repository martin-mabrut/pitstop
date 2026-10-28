import { useVehicle, type Vehicle } from '../../contexts/VehicleProvider';
import Modal from './modal';

interface AddVehicleProps {
    onClose: () => void;
    onCreated: (vehicle: Vehicle) => void;
}

export default function AddVehicle({ onClose, onCreated }: AddVehicleProps) {
    const { addVehicle } = useVehicle();

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const vehicle = await addVehicle({
            vehicleType: form.get('vehicleType') as string,
            registrationNumber: form.get('registrationNumber') as string,
            brand: form.get('brand') as string,
            model: form.get('model') as string,
            version: form.get('version') as string,
            firstRegistrationDateAt: form.get('firstRegistrationDateAt') as string,
            typeOfFuel: form.get('typeOfFuel') as string,
            typeOfTransmission: form.get('typeOfTransmission') as string,
            mileage: Number(form.get('mileage')),
            kmPerDay: Number(form.get('kmPerDay')),
        });
        if (vehicle) {
            onCreated(vehicle);
        } else {
            onClose();
        }
    }

    return (
        <Modal title="Ajouter un véhicule" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <label className="form-label w-100 mb-3">
                    Type de véhicule
                    <select name="vehicleType" className="form-select mt-1" required>
                        <option value="Voiture">Voiture</option>
                        <option value="VUL">VUL</option>
                        <option value="Deux-roues">Deux-roues</option>
                    </select>
                </label>
                <label className="form-label w-100 mb-3">
                    Immatriculation
                    <input name="registrationNumber" className="form-control mt-1" required />
                </label>
                <label className="form-label w-100 mb-3">
                    Marque
                    <input name="brand" className="form-control mt-1" required />
                </label>
                <label className="form-label w-100 mb-3">
                    Modèle
                    <input name="model" className="form-control mt-1" required />
                </label>
                <label className="form-label w-100 mb-3">
                    Version
                    <input name="version" className="form-control mt-1" />
                </label>
                <label className="form-label w-100 mb-3">
                    Date de première immatriculation
                    <input type="date" name="firstRegistrationDateAt" className="form-control mt-1" required />
                </label>
                <label className="form-label w-100 mb-3">
                    Carburant
                    <select name="typeOfFuel" className="form-select mt-1" required>
                        <option value="Essence">Essence</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electrique">Électrique</option>
                    </select>
                </label>
                <label className="form-label w-100 mb-3">
                    Boîte de vitesses
                    <select name="typeOfTransmission" className="form-select mt-1" required>
                        <option value="Manuelle">Manuelle</option>
                        <option value="Automatique">Automatique</option>
                    </select>
                </label>
                <label className="form-label w-100 mb-3">
                    Kilométrage
                    <input type="number" name="mileage" min="0" className="form-control mt-1" />
                </label>
                <label className="form-label w-100">
                    Kilomètres par jour
                    <input type="number" name="kmPerDay" min="0" className="form-control mt-1" />
                </label>
                <div className="modal-pitstop__actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
                    <button type="submit" className="btn btn-success">Ajouter</button>
                </div>
            </form>
        </Modal>
    );
}
