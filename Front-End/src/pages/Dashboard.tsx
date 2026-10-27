import { useEffect } from 'react';
import { Link } from 'react-router';
import { useVehicle } from '../contexts/VehicleProvider';
import { useSafety } from '../contexts/SafetyInspectionProvider'
import { useUser } from '../contexts/UserProvider'
import CardVehicule from '../components/CardVehicule/CardVehicule';
import CardSafetyInspection from '../components/CardSafetyInspection/CardSafetyInspection';
import './Dashboard.css';

export default function Dashboard() {
    const { vehicles, getVehicle } = useVehicle();

    const { getSafetyInspections, safetyList } = useSafety();

    const { getUser, user } = useUser();

    useEffect(() => {
        getVehicle(); getSafetyInspections(); getUser();
    }, []);


    return (
        <div className="container">
            <h1>Dashboard</h1>
            <p>{user?.username}</p>

            <div className="row g-3 mb-4">
                <div className="col-12 col-lg-6">
                    <button type="button" className="dashboard-action">
                        <span className="dashboard-action__plus">+</span>
                        Ajouter une réparation
                    </button>
                </div>
                <div className="col-12 col-lg-6">
                    <button type="button" className="dashboard-action">
                        <span className="dashboard-action__plus">+</span>
                        Ajouter un véhicule
                    </button>
                </div>
            </div>

            {showAdd && (
                <AddVehicle onClose={function () { setShowAdd(false); }} />
            )}
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
        </div>
    );
}
