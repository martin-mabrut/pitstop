import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useVehicle } from '../contexts/VehicleProvider';
import { useAuth } from '../contexts/AuthProvider';
import { useSafety } from '../contexts/SafetyInspectionProvider';
import { useRepairs } from '../contexts/RepairsProvider';
import CardSafetyInspection from '../components/CardSafetyInspection/CardSafetyInspection';

function formatDate(date?: string) {
    return date ? new Date(date).toLocaleDateString('fr-FR') : '-';
}

export default function VehiclePage() {
    const { uuid } = useParams();
    const { user } = useAuth();
    const { vehicles, getVehicle } = useVehicle();
    const { getSafetyInspections, safetyList } = useSafety();
    const { getRepairs, repairsList } = useRepairs();

    useEffect(() => {
        getVehicle(); getSafetyInspections(); getRepairs();
    }, []);


    const vehicle = vehicles.find((v) => String(v.id) === uuid);

    if (!vehicle) return <p>Véhicule introuvable</p>;

    return (
        <div className="container">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <h1 className="mb-0">{vehicle.brand} {vehicle.model}</h1>
                <button type="button" className="btn btn-sm btn-secondary">
                    Modifier
                </button>
                <button type="button" className="btn btn-sm btn-danger">
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
        </div>
    );
}
