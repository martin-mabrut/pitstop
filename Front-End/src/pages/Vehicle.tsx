import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useVehicle } from '../contexts/VehicleProvider';
import { useUser } from '../contexts/UserProvider';
import { useSafety } from '../contexts/SafetyInspectionProvider';
import { useRepairs } from '../contexts/RepairsProvider';
import CardSafetyInspection from '../components/CardSafetyInspection/CardSafetyInspection';
import EditVehicle from '../components/modal/editVehicle';
import DeleteVehicle from '../components/modal/deleteVehicle';
import AddRepair from '../components/modal/addRepairs';
import RepairHistory from '../components/modal/repairHistory';
import SafetyHistory from '../components/modal/safetyHistory';

function formatDate(date?: string) {
    return date ? new Date(date).toLocaleDateString('fr-FR') : '-';
}

export default function VehiclePage() {
    const { uuid } = useParams();
    const { user, getUser } = useUser();
    const { vehicles, getVehicle } = useVehicle();
    const { getSafetyInspections, safetyList } = useSafety();
    const { getRepairs, repairsList } = useRepairs();

    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showAddRepair, setShowAddRepair] = useState(false);
    const [showSafetyHistory, setShowSafetyHistory] = useState(false);

    useEffect(function () {
        getVehicle();
        getUser();
        if (uuid) {
            getSafetyInspections(uuid);
            getRepairs(uuid);
        }
    }, [uuid]);

    const vehicle = vehicles.find(function (v) {
        return String(v.id) === uuid;
    });

    if (!vehicle) return <p>Véhicule introuvable</p>;

    return (
        <div className="container">
            <Link to="/dashboard" className="btn btn-sm btn-secondary mb-3">
                ← Retour
            </Link>

            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <h1 className="mb-0">{vehicle.brand} {vehicle.model}</h1>
                <button type="button" className="btn btn-sm btn-secondary" onClick={function () { setShowEdit(true); }}>
                    Modifier
                </button>
                <button type="button" className="btn btn-sm btn-danger" onClick={function () { setShowDelete(true); }}>
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
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <h2 className="mb-0">Historique des réparations</h2>
                        <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={function () { setShowAddRepair(true); }}
                        >
                            Ajouter
                        </button>
                    </div>
                    <ul>
                        {repairsList.slice(0, 3).map(function (repair) {
                            return (
                                <li key={repair.id}>
                                    {formatDate(repair.repairDate)} - {repair.typeOfRepairs} : {repair.description} ({repair.price} €)
                                </li>
                            );
                        })}
                    </ul>
                    <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={function () { setShowHistory(true); }}
                    >
                        Historique des réparations
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
                    <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={function () { setShowSafetyHistory(true); }}
                    >
                        Voir tout
                    </button>
                </div>
            </div>

            {showEdit && (
                <EditVehicle vehicle={vehicle} onClose={function () { setShowEdit(false); }} />
            )}

            {showDelete && (
                <DeleteVehicle vehicle={vehicle} onClose={function () { setShowDelete(false); }} />
            )}

            {showAddRepair && uuid && (
                <AddRepair
                    vehicleId={uuid}
                    onClose={function () { setShowAddRepair(false); }}
                />
            )}

            {showHistory && uuid && (
                <RepairHistory
                    vehicleId={uuid}
                    repairs={repairsList}
                    onClose={function () { setShowHistory(false); }}
                />
            )}

            {showSafetyHistory && (
                <SafetyHistory
                    inspections={safetyList}
                    onClose={function () { setShowSafetyHistory(false); }}
                />
            )}
        </div>
    );
}