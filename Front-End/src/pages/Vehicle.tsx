import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useVehicle } from '../contexts/VehicleProvider';
import { useAuth } from '../contexts/AuthProvider';
import { useSafety } from '../contexts/SafetyInspectionProvider';
import { useRepairs } from '../contexts/RepairsProvider';
import CardSafetyInspection from '../components/CardSafetyInspection/CardSafetyInspection';
import EditVehicle from '../components/modal/editVehicle';
import DeleteVehicle from '../components/modal/deleteVehicle';

function formatDate(date?: string) {
    return date ? new Date(date).toLocaleDateString('fr-FR') : '-';
}

export default function VehiclePage() {
    const { uuid } = useParams();
    const { user } = useAuth();
    const { vehicles, getVehicle } = useVehicle();
    const { getSafetyInspections, safetyList } = useSafety();
    const { getRepairs, repairsList } = useRepairs();
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        getVehicle(); getSafetyInspections(); getRepairs();
    }, []);


    const vehicle = vehicles.find((v) => String(v.id) === uuid);

    if (!vehicle) return <p>Véhicule introuvable</p>;

    return (
        <div className="container">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <h1 className="mb-0">{vehicle.brand} {vehicle.model}</h1>
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowEdit(true)}>
                    Modifier
                </button>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => setShowDelete(true)}>
                    Supprimer
                </button>
            </div>
            <p>Identifiant : {vehicle.id}</p>

            <div>
                <h2>Mes échéances</h2>
                <div className="row g-3">
                    {safetyList[0] && (
                        <div className="col-12 col-lg-6">
                            <CardSafetyInspection inspection={safetyList[0]} />
                        </div>
                    )}
                    {safetyList[1] && (
                        <div className="col-12 col-lg-6">
                            <CardSafetyInspection inspection={safetyList[1]} />
                        </div>
                    )}
                </div>
            </div>

            <div className="row g-3 mt-4">
                <div className="col-12 col-lg-6">
                    <h2>Historique des réparations</h2>
                    <ul>
                        {repairsList.slice(0, 3).map((repair) => (
                            <li key={repair.id}>
                                {formatDate(repair.repairDate)} - {repair.typeOfRepairs} : {repair.description} ({repair.price} €)
                            </li>
                        ))}
                    </ul>
                    <button type="button" className="btn btn-sm btn-secondary">
                        Voir tout
                    </button>
                </div>

                <div className="col-12 col-lg-6">
                    <h2>Historique des contrôles techniques</h2>
                    <ul>
                        {safetyList.slice(0, 3).map((ct) => (
                            <li key={ct.id}>
                                {formatDate(ct.dueTime)} - {ct.type} : réalisé le {formatDate(ct.isDone)}
                            </li>
                        ))}
                    </ul>
                    <button type="button" className="btn btn-sm btn-secondary">
                        Voir tout
                    </button>
                </div>
            </div>

            {showEdit && (
                <EditVehicle vehicle={vehicle} onClose={() => setShowEdit(false)} />
            )}

            {showDelete && (
                <DeleteVehicle vehicle={vehicle} onClose={() => setShowDelete(false)} />
            )}
        </div>
    );
}
