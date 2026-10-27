import type { Vehicle } from '../../contexts/VehicleProvider'
import './CardVehicule.css'

interface CardVehiculeProps {
  vehicle: Vehicle
}

function CardVehicule({ vehicle }: CardVehiculeProps) {
  return (
    <div className="card-vehicule">
      <div className="card-vehicule__infos">
        <h3>{vehicle.brand} {vehicle.model}</h3>
        <p>Immatriculation : {vehicle.registrationNumber}</p>
        <p>Année : {vehicle.version}</p>
        <p>Carburant : {vehicle.typeOfFuel}</p>
        <p>Kilométrage : {vehicle.mileage?.toLocaleString('fr-FR')} km</p>
      </div>
    </div>
  )
}

export default CardVehicule
