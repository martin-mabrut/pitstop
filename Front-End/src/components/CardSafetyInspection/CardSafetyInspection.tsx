import './CardSafetyInspection.css'
import type { ReactNode } from 'react'
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
  children?: ReactNode
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

const TYPE_LABELS: Record<string, string> = {
  regular: 'Périodique',
  followUp: 'Contre-visite',
}

function CardSafetyInspection({ inspection, children }: CardSafetyInspectionProps) {
  const lightsClass = getLightsClass(inspection.dueTimeAt)

  return (
    <div className="card-safety">
      <div className={`card-safety__lights ${lightsClass}`}>
        <span className="card-safety__light card-safety__light--red" />
        <span className="card-safety__light card-safety__light--yellow" />
        <span className="card-safety__light card-safety__light--green" />
      </div>

      <div className="card-safety__content">
        <p className="card-safety__label">Contrôle technique</p>
        <h3 className="card-safety__title">
          {inspection.vehicle ? inspection.vehicle.model : 'Mon véhicule'}
        </h3>
        <span className="card-safety__badge">{TYPE_LABELS[inspection.type] ?? inspection.type}</span>

        <dl className="card-safety__details">
          {!inspection.doneAt && (
            <div>
              <dt>Échéance</dt>
              <dd>{formatDate(inspection.dueTimeAt)}</dd>
            </div>
          )}
          <div>
            <dt>Réalisé le</dt>
            <dd>{formatDate(inspection.doneAt)}</dd>
          </div>
        </dl>

        {children}
      </div>
    </div>
  )
}

export default CardSafetyInspection
