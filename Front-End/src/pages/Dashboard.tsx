
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useVehicle, type Vehicle } from '../contexts/VehicleProvider';
import { useSafety } from '../contexts/SafetyInspectionProvider';
import { useUser } from '../contexts/UserProvider';

import CardVehicule from '../components/CardVehicule/CardVehicule';
import CardSafetyInspection from '../components/CardSafetyInspection/CardSafetyInspection';
import AddVehicle from '../components/modal/addVehicle';
import AddSafetyWhenVehicleCreated from '../components/modal/addSafetyWhenVehicleCreated';
import AddRepair from '../components/modal/addRepairs';
import './Dashboard.css';

export default function Dashboard() {
    const { vehicles, getVehicle } = useVehicle();
    const { getSafetyInspectionsNotDone, safetyList } = useSafety();
    const { getUser, user } = useUser();

    const [showAdd, setShowAdd] = useState(false);
    const [showAddRepair, setShowAddRepair] = useState(false);
    const [createdVehicle, setCreatedVehicle] = useState<Vehicle | null>(null);

    useEffect(() => {
        void getVehicle();
        void getSafetyInspectionsNotDone();
        void getUser();
    }, []);

    return (
        <div className="container">
            <h1>DASHBOARD</h1>

            <p>{user?.username}</p>

            <div className="row g-3 mb-4">
                <div className="col-12 col-lg-6">
                    <button
                        type="button"
                        className="dashboard-action"
                        onClick={() => setShowAddRepair(true)}
                    >
                        <span className="dashboard-action__plus">+</span>
                        Ajouter une réparation
                    </button>
                </div>

                <div className="col-12 col-lg-6">
                    <button
                        type="button"
                        className="dashboard-action"
                        onClick={() => setShowAdd(true)}
                    >
                        <span className="dashboard-action__plus">+</span>
                        Ajouter un véhicule
                    </button>
                </div>
            </div>

            <section className="mb-4">
                <h2>Mes échéances</h2>

                <div className="row g-3">
                    {safetyList.map((inspection) => (
                        <div
                            className="col-12 col-lg-6"
                            key={inspection.id}
                        >
                            <CardSafetyInspection inspection={inspection} />
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2>Mes véhicules</h2>

                <div className="row g-3">
                    {vehicles.map((vehicle) => {
                        if (vehicle.id == null) {
                            return null;
                        }

                        return (
                            <div
                                key={vehicle.id}
                                className="col-12 col-lg-6"
                            >
                                <Link
                                    to={`/vehicle/${vehicle.id}`}
                                    className="dashboard-vehicles__link"
                                >
                                    <CardVehicule vehicle={vehicle} />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </section>

            {showAdd && (
                <AddVehicle
                    onClose={function () { setShowAdd(false); }}
                    onCreated={function (vehicle) {
                        setShowAdd(false);
                        setCreatedVehicle(vehicle);
                    }}
                />
            )}

            {createdVehicle && (
                <AddSafetyWhenVehicleCreated
                    vehicle={createdVehicle}
                    onClose={function () {
                        setCreatedVehicle(null);
                        getSafetyInspectionsNotDone();
                    }}
                />
            )}

            {showAddRepair && (
                <AddRepair
                    onClose={() => setShowAddRepair(false)}
                />
            )}
        </div>
    );
}
