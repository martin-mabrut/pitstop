import './CardSafetyInspection.css'
import type { Vehicle } from '../../contexts/VehicleProvider'


export interface SafetyInspection {
  id: string | number
  dueTimeAt: string
  doneAt?: string
  type: string
  vehicle?: Vehicle
}

interface CardSafetyInspectionProps {
  inspection: SafetyInspection
}

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString('fr-FR') : '-'
}

function CardSafetyInspection({ inspection }: CardSafetyInspectionProps) {
  return (
    <div className="card-safety">
      <div className="row align-items-center gx-4">
        <div className="col-auto">
          <div className="card-safety__lights">
            <span className="card-safety__light card-safety__light--red" />
            <span className="card-safety__light card-safety__light--yellow" />
            <span className="card-safety__light card-safety__light--green" />
          </div>
        </div>

        <div className="col">
          <h3>Contrôle technique</h3>
          {inspection.vehicle && (
            <p className="fw-bold">{inspection.vehicle.model}</p>
          )}
          <p>Type : {inspection.type}</p>
          <p>Échéance : {formatDate(inspection.dueTimeAt)}</p>
          <p>Réalisé le : {formatDate(inspection.doneAt)}</p>
        </div>
      </div>
    </div>
  )
}

export default CardSafetyInspection
