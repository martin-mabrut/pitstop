
import { useEffect, useState, type FormEvent } from 'react';

import { useSafety } from '../../contexts/SafetyInspectionProvider';

import type { SafetyInspection } from '../CardSafetyInspection/CardSafetyInspection';

interface Props {
    vehicleId: string;
    inspection: SafetyInspection;
    canValidate: boolean;
    onClose: () => void;
}

function toInputDate(value?: string | null): string {
    if (!value) return '';

    // Gère les dates ISO, y compris celles terminées par Z.
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '';

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-');
}

export default function EditSafetyInspection({
    vehicleId,
    inspection,
    canValidate,
    onClose,
}: Props) {
    const {
        updateSafetyInspections,
        validateSafetyInspections,
    } = useSafety();

    const [dueTimeAt, setDueTimeAt] = useState(
        toInputDate(inspection.dueTimeAt)
    );

    const [doneAt, setDoneAt] = useState(
        toInputDate(inspection.doneAt)
    );

    const [valid, setValid] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setDueTimeAt(toInputDate(inspection.dueTimeAt));
        setDoneAt(toInputDate(inspection.doneAt));
        setValid(true);
        setError('');
    }, [inspection]);

    function checkIds(): boolean {
        if (
            !vehicleId ||
            vehicleId === 'undefined' ||
            vehicleId === 'null' ||
            !inspection.id
        ) {
            setError(
                'Identifiant du véhicule ou du contrôle technique invalide.'
            );

            console.error('Identifiants reçus par le modal :', {
                vehicleId,
                safetyId: inspection.id,
            });

            return false;
        }

        return true;
    }

    async function handleSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');

        if (!checkIds()) return;

        if (!dueTimeAt) {
            setError("La date d'échéance est obligatoire.");
            return;
        }

        setLoading(true);

        try {
            const success = await updateSafetyInspections(
                vehicleId,
                String(inspection.id),
                {
                    dueTimeAt,
                    doneAt: doneAt || null,
                    type: inspection.type,
                }
            );

            if (!success) {
                setError(
                    'Modification impossible.'
                );
                return;
            }

            onClose();
        } catch (error) {
            console.error(error);
            setError('Une erreur est survenue lors de la modification.');
        } finally {
            setLoading(false);
        }
    }

    async function handleValidate() {
        setError('');

        if (!checkIds()) return;

        if (!doneAt) {
            setError('Renseigne la date de visite.');
            return;
        }

        setLoading(true);

        try {
            const success = await validateSafetyInspections(
                vehicleId,
                String(inspection.id),
                {
                    doneAt,
                    valid,
                }
            );

            if (!success) {
                setError(
                    'Validation impossible.'
                );
                return;
            }

            onClose();
        } catch (error) {
            console.error(error);
            setError('Une erreur est survenue lors de la validation.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="modal d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={handleSave}>
                        <div className="modal-header">
                            <h2 className="modal-title fs-5">
                                Modifier le contrôle technique
                            </h2>

                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Fermer"
                                onClick={onClose}
                                disabled={loading}
                            />
                        </div>

                        <div className="modal-body">
                            <div className="mb-3">
                                <label
                                    htmlFor="inspectionDueTimeAt"
                                    className="form-label"
                                >
                                    Date d'échéance
                                </label>

                                <input
                                    id="inspectionDueTimeAt"
                                    type="date"
                                    className="form-control"
                                    value={dueTimeAt}
                                    onChange={(event) =>
                                        setDueTimeAt(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label
                                    htmlFor="inspectionDoneAt"
                                    className="form-label"
                                >
                                    Date de visite
                                </label>

                                <input
                                    id="inspectionDoneAt"
                                    type="date"
                                    className="form-control"
                                    value={doneAt}
                                    onChange={(event) =>
                                        setDoneAt(event.target.value)
                                    }
                                    required={canValidate}
                                />
                            </div>

                            {canValidate && (
                                <div className="mb-3">
                                    <label
                                        htmlFor="inspectionValid"
                                        className="form-label"
                                    >
                                        Résultat du contrôle
                                    </label>

                                    <select
                                        id="inspectionValid"
                                        className="form-select"
                                        value={String(valid)}
                                        onChange={(event) =>
                                            setValid(
                                                event.target.value === 'true'
                                            )
                                        }
                                    >
                                        <option value="true">
                                            Validé
                                        </option>

                                        <option value="false">
                                            Non validé
                                        </option>
                                    </select>
                                </div>
                            )}

                            {error && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading
                                    ? 'Enregistrement...'
                                    : 'Enregistrer'}
                            </button>

                            {canValidate && (
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleValidate}
                                    disabled={loading}
                                >
                                    {loading
                                        ? 'Traitement...'
                                        : 'Valider le contrôle'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
