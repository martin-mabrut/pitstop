import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useVehicle } from '../contexts/VehicleProvider';
import { useAuth } from '../contexts/AuthProvider';

export default function VehiclePage() {
    const { uuid } = useParams();
    const { user } = useAuth();
    const { vehicles, getVehicle } = useVehicle();

    useEffect(() => {
        getVehicle();
    }, []);


    const vehicle = vehicles.find((v) => String(v.id) === uuid);

    if (!vehicle) return <p>Véhicule introuvable</p>;

    return (
        <div>
            <h1>{vehicle.brand} {vehicle.model}</h1>
            <p>Identifiant : {vehicle.id}</p>
        </div>
    );
}