
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { useVehicle } from '../contexts/VehicleProvider';
import { useSafety } from '../contexts/SafetyInspectionProvider';
import { useUser } from '../contexts/UserProvider';

import CardVehicule from '../components/CardVehicule/CardVehicule';
import CardSafetyInspection from '../components/CardSafetyInspection/CardSafetyInspection';
import AddVehicle from '../components/modal/addVehicle';
import AddRepair from '../components/modal/addRepairs';
import UserProfile from '../components/modal/userProfile';

import './Dashboard.css';

export default function Dashboard() {
    const { vehicles, getVehicle } = useVehicle();
    const { getSafetyInspectionsNotDone, safetyList } = useSafety();
    const { getUser, user } = useUser();

    const [showAdd, setShowAdd] = useState(false);
    const [showAddRepair, setShowAddRepair] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        void getVehicle();
        void getSafetyInspectionsNotDone();
        void getUser();
    }, []);

    return (
        <div className="container">
            <h1>Dashboard</h1>

            <button
                type="button"
                className="btn btn-link p-0 mb-3"
                onClick={() => setShowProfile(true)}
            >
                {user?.username ?? 'Mon profil'}
            </button>

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
                    {safetyList.slice(0, 2).map((inspection) => (
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
                    onClose={() => {
                        setShowAdd(false);
                        void getVehicle();
                    }}
                />
            )}

            {showAddRepair && (
                <AddRepair
                    onClose={() => setShowAddRepair(false)}
                />
            )}

            {showProfile && (
                <UserProfile
                    onClose={() => setShowProfile(false)}
                />
            )}
        </div>
    );
}
