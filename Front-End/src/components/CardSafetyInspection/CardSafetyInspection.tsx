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

function isMoreThanTwoMonthsAway(date: string) {
  const limit = new Date()
  limit.setMonth(limit.getMonth() + 2)
  return new Date(date) > limit
}

function isPast(date: string) {
  return new Date(date) < new Date()
}

function getLightsClass(date: string) {
  if (isPast(date)) return 'card-safety__lights--red'
  if (isMoreThanTwoMonthsAway(date)) return 'card-safety__lights--green'
  return 'card-safety__lights--yellow'
}

function CardSafetyInspection({ inspection }: CardSafetyInspectionProps) {
  const lightsClass = getLightsClass(inspection.dueTimeAt)

  return (
    <div className="card-safety">
      <div className="row align-items-center gx-4">
        <div className="col-auto">
          <div className={`card-safety__lights ${lightsClass}`}>
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
