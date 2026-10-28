
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';

import { useVehicle } from '../contexts/VehicleProvider';
import { useUser } from '../contexts/UserProvider';
import { useSafety } from '../contexts/SafetyInspectionProvider';
import { useRepairs } from '../contexts/RepairsProvider';

import CardSafetyInspection, {
    type SafetyInspection,
} from '../components/CardSafetyInspection/CardSafetyInspection';

import EditVehicle from '../components/modal/editVehicle';
import DeleteVehicle from '../components/modal/deleteVehicle';
import AddRepair from '../components/modal/addRepairs';
import RepairHistory from '../components/modal/repairHistory';
import SafetyHistory from '../components/modal/safetyHistory';
import EditSafetyInspection from '../components/modal/editSafetyInspection';

function formatDate(date?: string | null): string {
    if (!date) return '-';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return '-';
    }

    return parsedDate.toLocaleDateString('fr-FR');
}

export default function VehiclePage() {
    const { uuid } = useParams<{ uuid: string }>();

    const { vehicles, getVehicle } = useVehicle();
    const { getUser } = useUser();
    const { getSafetyInspections, safetyList } = useSafety();
    const { getRepairs, repairsList } = useRepairs();

    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showAddRepair, setShowAddRepair] = useState(false);
    const [showSafetyHistory, setShowSafetyHistory] = useState(false);

    const [selectedInspection, setSelectedInspection] =
        useState<SafetyInspection | null>(null);

    useEffect(() => {
        if (!uuid) {
            console.error(
                'Identifiant du véhicule absent de la route.'
            );
            return;
        }

        void getVehicle();
        void getUser();
        void getSafetyInspections(uuid);
        void getRepairs(uuid);
    }, [uuid]);

    const decodedUuid = uuid
        ? decodeURIComponent(uuid)
        : '';

    const vehicle = vehicles.find((item) => {
        const identifier = item.id ?? item.uuid ?? item.uid;

        return (
            identifier !== undefined &&
            identifier !== null &&
            String(identifier) === decodedUuid
        );
    });

    if (!uuid) {
        return (
            <div className="container">
                <p>
                    Identifiant du véhicule absent de l'URL.
                </p>
                <Link to="/dashboard" className="btn btn-secondary">
                    Retour au dashboard
                </Link>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="container">
                <p>
                    Chargement du véhicule ou véhicule introuvable.
                </p>
                <Link to="/dashboard" className="btn btn-secondary">
                    Retour au dashboard
                </Link>
            </div>
        );
    }

    const vehicleId = String(
        vehicle.id ?? vehicle.uuid ?? vehicle.uid
    );

    const canValidate =
        selectedInspection !== null &&
        String(selectedInspection.id) ===
            String(safetyList[0]?.id);

    return (
        <div className="container">
            <Link
                to="/dashboard"
                className="btn btn-sm btn-secondary mb-3"
            >
                ← Retour
            </Link>

            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <h1 className="mb-0">
                    {vehicle.brand} {vehicle.model}
                </h1>

                <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => setShowEdit(true)}
                >
                    Modifier
                </button>

                <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => setShowDelete(true)}
                >
                    Supprimer
                </button>
            </div>

            <p>Identifiant : {vehicleId}</p>
            <p>Immatriculation : {vehicle.registrationNumber}</p>

            <section>
                <h2>Mes échéances</h2>

                <div className="row g-3">
                    {safetyList.slice(0, 2).map((inspection, index) => (
                        <div
                            className="col-12 col-lg-6"
                            key={inspection.id}
                        >
                            <CardSafetyInspection
                                inspection={inspection}
                            />

                            <button
                                type="button"
                                className="btn btn-sm btn-primary mt-2"
                                onClick={() =>
                                    setSelectedInspection(inspection)
                                }
                            >
                                {index === 0
                                    ? 'Modifier / Valider'
                                    : 'Modifier'}
                            </button>
                        </div>
                    ))}

                    {safetyList.length === 0 && (
                        <div className="col-12">
                            <p>Aucun contrôle technique à afficher.</p>
                        </div>
                    )}
                </div>
            </section>

            <div className="row g-3 mt-4">
                <section className="col-12 col-lg-6">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <h2 className="mb-0">
                            Historique des réparations
                        </h2>

                        <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() => setShowAddRepair(true)}
                        >
                            Ajouter
                        </button>
                    </div>

                    <ul>
                        {repairsList.slice(0, 3).map((repair) => (
                            <li key={repair.id}>
                                {formatDate(repair.repairDate)} -{' '}
                                {repair.typeOfRepairs} :{' '}
                                {repair.description} ({repair.price} €)
                            </li>
                        ))}
                    </ul>

                    <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => setShowHistory(true)}
                    >
                        Historique des réparations
                    </button>
                </section>

                <section className="col-12 col-lg-6">
                    <h2>Historique des contrôles techniques</h2>

                    <ul>
                        {safetyList.slice(0, 3).map((inspection) => (
                            <li key={inspection.id}>
                                {formatDate(inspection.dueTimeAt)} -{' '}
                                {inspection.type} : réalisé le{' '}
                                {formatDate(inspection.doneAt)}
                            </li>
                        ))}
                    </ul>

                    <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => setShowSafetyHistory(true)}
                    >
                        Voir tout
                    </button>
                </section>
            </div>

            {showEdit && (
                <EditVehicle
                    vehicle={vehicle}
                    onClose={() => {
                        setShowEdit(false);
                        void getVehicle();
                    }}
                />
            )}

            {showDelete && (
                <DeleteVehicle
                    vehicle={vehicle}
                    onClose={() => {
                        setShowDelete(false);
                        void getVehicle();
                    }}
                />
            )}

            {showAddRepair && (
                <AddRepair
                    vehicleId={vehicleId}
                    onClose={() => setShowAddRepair(false)}
                />
            )}

            {showHistory && (
                <RepairHistory
                    vehicleId={vehicleId}
                    repairs={repairsList}
                    onClose={() => setShowHistory(false)}
                />
            )}

            {showSafetyHistory && (
                <SafetyHistory
                    inspections={safetyList}
                    onClose={() => setShowSafetyHistory(false)}
                />
            )}

            {selectedInspection && (
                <EditSafetyInspection
                    vehicleId={vehicleId}
                    inspection={selectedInspection}
                    canValidate={canValidate}
                    onClose={() => {
                        setSelectedInspection(null);
                    }}
                />
            )}
        </div>
    );
}
