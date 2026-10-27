<<<<<<< HEAD
import { useEffect } from 'react';
import { Link } from 'react-router';
import { useVehicle, type Vehicle } from '../contexts/VehicleProvider';

export default function Dashboard() {
    const { vehicles, getVehicle, deleteVehicle, updateVehicle, addVehicle } = useVehicle();

    useEffect(() => {
        getVehicle();
    }, []);

    const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        await addVehicle({
            brand: data.get('brand') as string,
            model: data.get('model') as string,
        });
        form.reset();
    };


    const handleUpdate = async (vehicle: Vehicle) => {
        await updateVehicle(vehicle.id, { model: vehicle.model + ' (modifié)' });
    };

    // SUPPRIMER
    const handleDelete = async (id: Vehicle['id']) => {
        await deleteVehicle(id);
    };


    return (
        <div>
            <h1>Mes véhicules</h1>

            <form onSubmit={handleAdd}>
                <input name="brand" placeholder="Marque" required />
                <input name="model" placeholder="Modele" required />
                <button type="submit">Ajouter</button>
            </form>

            <h1>Mes véhicules</h1>
            <ul>
                {vehicles.map((v) => (
                    <li key={v.id}>
                        <Link to={`/vehicle/${v.id}`}>{v.brand} {v.model}</Link>
                        <button onClick={() => handleUpdate(v)}>Modifier</button>
                        <button onClick={function () { handleDelete(v.id); }}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
=======
import { useSafety } from '../contexts/SafetyInspectionProvider';
import { useState } from 'react';
import { useEffect } from 'react';

export default function Dashboard() {

    const { getSafetyInspections, safetyList } = useSafety();

    // const list = safetyInspectionDashboard;

    // const [safetyList, setSafetyList] = useState([list]);
    // console.log(safetyList);

    useEffect(() => {
        getSafetyInspections()
    }, []);

    const safetys = safetyList;

    return (
        <>
            <div>
                <h1>Dashboard</h1>
            </div>

            <div>
                <h2>Mes échéances</h2>
                <ul>
                    {safetys.map((ct) => (
                        <li key={ct.id}>
                            {ct.dueTime}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
>>>>>>> 2dc488f (Front avant pull back)
}