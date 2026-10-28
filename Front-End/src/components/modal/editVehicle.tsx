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
        <Modal title="Modifier le véhicule" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <label className="form-label w-100 mb-3">
                        Type de véhicule
                        <select name="vehicleType" defaultValue={vehicle.vehicleType} className="form-select mt-1" required>
                            <option value="Voiture">Voiture</option>
                            <option value="Moto">Moto</option>
                            <option value="Camion">Camion</option>
                        </select>
                    </label>
                    <label className="form-label w-100 mb-3">
                        Immatriculation
                        <input name="registrationNumber" defaultValue={vehicle.registrationNumber} className="form-control mt-1" required />
                    </label>
                    <label className="form-label w-100 mb-3">
                        Marque
                        <input name="brand" defaultValue={vehicle.brand} className="form-control mt-1" required />
                    </label>
                    <label className="form-label w-100 mb-3">
                        Modèle
                        <input name="model" defaultValue={vehicle.model} className="form-control mt-1" required />
                    </label>
                    <label className="form-label w-100 mb-3">
                        Version
                        <input name="version" defaultValue={vehicle.version} className="form-control mt-1" />
                    </label>
                    <label className="form-label w-100 mb-3">
                        Date de première immatriculation
                        <input name="firstRegistrationDate" type="date" defaultValue={vehicle.firstRegistrationDate} className="form-control mt-1" required />
                    </label>
                    <label className="form-label w-100 mb-3">
                        Carburant
                        <select name="typeOfFuel" defaultValue={vehicle.typeOfFuel} className="form-select mt-1" required>
                            <option value="Essence">Essence</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Électrique">Électrique</option>
                            <option value="Hybride">Hybride</option>
                        </select>
                    </label>
                    <label className="form-label w-100 mb-3">
                        Transmission
                        <input name="typeOfTransmission" defaultValue={vehicle.typeOfTransmission} className="form-control mt-1" required />
                    </label>
                    <label className="form-label w-100 mb-3">
                        Kilométrage
                        <input name="mileage" type="number" min="0" defaultValue={vehicle.mileage} className="form-control mt-1" required />
                    </label>
                    <label className="form-label w-100 mb-3">
                        Km par jour
                        <input name="kmPerDay" type="number" min="0" defaultValue={vehicle.kmPerDay} className="form-control mt-1" required />
                    </label>
                </div>
                <div className="modal-pitstop__actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                </div>
            </form>
        </Modal>
    );
}