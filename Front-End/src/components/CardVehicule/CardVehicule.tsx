import type { Vehicle } from '../../contexts/VehicleProvider'
import './CardVehicule.css'

interface CardVehiculeProps {
  vehicle: Vehicle
}

function CardVehicule({ vehicle }: CardVehiculeProps) {
  return (
    <div className="card-vehicule">
      <div className="card-vehicule__infos">
        <h3>{vehicle.brand}</h3>
        <p className="h3">{vehicle.model}</p>
      </div>
    </div>
  )
}

export default CardVehicule
