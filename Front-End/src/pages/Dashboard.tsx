import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useVehicle, type Vehicle } from '../contexts/VehicleProvider';
import AddVehicle from '../components/modal/addVehicle';
import EditVehicle from '../components/modal/editVehicle';
import DeleteVehicle from '../components/modal/deleteVehicle';

export default function Dashboard() {
    const { vehicles, getVehicle, updateVehicle, deleteVehicle } = useVehicle();
    const [showAdd, setShowAdd] = useState(false);
    const [editing, setEditing] = useState<Vehicle | null>(null);
    const [deleting, setDeleting] = useState<Vehicle | null>(null);

    const { getSafetyInspections, safetyList } = useSafety();

    useEffect(() => {
        getVehicle(); getSafetyInspections();
    }, []);


    return (
        <div>
            <h1>Mes véhicules</h1>

            <button onClick={function () { setShowAdd(true); }}>
                Ajouter un véhicule
            </button>

            <ul>
                {vehicles.map(function (v) {
                    return (
                        <li key={v.id}>
                            <Link to={`/vehicle/${v.id}`}>
                                {v.brand} {v.model}
                            </Link>
                            <button onClick={function () { setEditing(v); }}>
                                Modifier
                            </button>
                            <button onClick={function () { setDeleting(v); }}>
                                Supprimer
                            </button>
                        </li>
                    );
                })}
            </ul>

            {showAdd && (
                <AddVehicle onClose={function () { setShowAdd(false); }} />
            )}

            {editing && (
                <EditVehicle
                    vehicle={editing}
                    onClose={function () { setEditing(null); }}
                />
            )}

            {deleting && (
                <DeleteVehicle
                    vehicle={deleting}
                    onClose={function () { setDeleting(null); }}
                />
            )}
        </div>
    );
}