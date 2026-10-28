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

    useEffect(function () {
        getVehicle();
        getSafetyInspectionsNotDone();
        getUser();
    }, []);

    return (
        <div className="container">
            <h1>Dashboard</h1>

            <button
                type="button"
                className="btn btn-link p-0 mb-3"
                onClick={function () { setShowProfile(true); }}
            >
                {user?.username}
            </button>

            <div className="row g-3 mb-4">
                <div className="col-12 col-lg-6">
                    <button type="button" className="dashboard-action" onClick={function () { setShowAddRepair(true); }}>
                        <span className="dashboard-action__plus">+</span>
                        Ajouter une réparation
                    </button>
                </div>
                <div className="col-12 col-lg-6">
                    <button type="button" className="dashboard-action" onClick={function () { setShowAdd(true); }}>
                        <span className="dashboard-action__plus">+</span>
                        Ajouter un véhicule
                    </button>
                </div>
            </div>

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

            <div>
                <h2>Mes véhicules</h2>
                <div className="row g-3">
                    {vehicles.map(function (v) {
                        return (
                            <div key={v.id} className="col-12 col-lg-6">
                                <Link to={`/vehicle/${v.id}`} className="dashboard-vehicles__link">
                                    <CardVehicule vehicle={v} />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>

            {showAdd && (
                <AddVehicle onClose={function () { setShowAdd(false); }} />
            )}

            {showAddRepair && (
                <AddRepair onClose={function () { setShowAddRepair(false); }} />
            )}

            {showProfile && (
                <UserProfile onClose={function () { setShowProfile(false); }} />
            )}
        </div>
    );
}