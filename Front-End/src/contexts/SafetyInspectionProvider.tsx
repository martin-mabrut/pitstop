
import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react';

import type { SafetyInspection } from '../components/CardSafetyInspection/CardSafetyInspection';

interface UpdateSafetyData {
    dueTimeAt?: string;
    doneAt?: string | null;
    type?: string;
}

interface ValidateSafetyData {
    doneAt: string;
    valid: boolean;
}

interface SafetyInspectionContextType {
    safetyList: SafetyInspection[];

    getSafetyInspections: (vehicleId: string) => Promise<void>;
    getSafetyInspectionsNotDone: () => Promise<void>;

    safetyInspectionYes: (
        vehicleId: string,
        doneAt: string
    ) => Promise<void>;

    safetyInspectionNo: (vehicleId: string) => Promise<void>;

    updateSafetyInspections: (
        vehicleId: string,
        safetyId: string,
        data: UpdateSafetyData
    ) => Promise<boolean>;

    validateSafetyInspections: (
        vehicleId: string,
        safetyId: string,
        data: ValidateSafetyData
    ) => Promise<boolean>;
}

interface Props {
    children: ReactNode;
}

const API_URL = 'http://localhost:8000/api/safetyInspection';

const SafetyInspectionContext =
    createContext<SafetyInspectionContextType | null>(null);

/**
 * Vérifie les identifiants avant de construire une URL.
 */
function hasValidId(id: string | number | null | undefined): boolean {
    const value = String(id ?? '').trim();

    return value !== '' && value !== 'undefined' && value !== 'null';
}

/**
 * Lit les réponses JSON et signale clairement les réponses HTML de Symfony.
 */
async function readResponse(response: Response): Promise<unknown> {
    const text = await response.text();

    if (!text.trim()) {
        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}`);
        }

        return {};
    }

    let result: unknown;

    try {
        result = JSON.parse(text);
    } catch {
        throw new Error(
            `Réponse non JSON du serveur (HTTP ${response.status}) : ` +
            text.slice(0, 500)
        );
    }

    if (!response.ok) {
        const data = result as {
            message?: string;
            detail?: string;
            title?: string;
        };

        throw new Error(
            data.message ||
            data.detail ||
            data.title ||
            `Erreur HTTP ${response.status}`
        );
    }

    return result;
}

export function SafetyInspectionProvider({ children }: Props) {
    const [safetyList, setSafetyList] = useState<SafetyInspection[]>([]);

    /**
     * Charge les contrôles d'un véhicule précis.
     */
    const getSafetyInspections = async (
        vehicleId: string
    ): Promise<void> => {
        if (!hasValidId(vehicleId)) {
            console.error(
                'Chargement impossible : identifiant du véhicule invalide.',
                vehicleId
            );
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/all/${encodeURIComponent(vehicleId)}`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );

            const result = await readResponse(response) as {
                safetyInspections?: SafetyInspection[];
            };

            setSafetyList(result.safetyInspections ?? []);
        } catch (error) {
            console.error(
                'Erreur lors du chargement des contrôles techniques :',
                error
            );
        }
    };

    /**
     * Charge les contrôles non réalisés de tous les véhicules.
     */
    const getSafetyInspectionsNotDone = async (): Promise<void> => {
        try {
            const response = await fetch(
                `${API_URL}/allNotDoneFromEveryVehicle`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );

            const result = await readResponse(response) as {
                safetyInspections?: SafetyInspection[];
            };

            setSafetyList(result.safetyInspections ?? []);
        } catch (error) {
            console.error(
                'Erreur lors du chargement des échéances :',
                error
            );
        }
    };

    /**
     * Modifie un contrôle technique.
     */
    const updateSafetyInspections = async (
        vehicleId: string,
        safetyId: string,
        data: UpdateSafetyData
    ): Promise<boolean> => {
        if (!hasValidId(vehicleId) || !hasValidId(safetyId)) {
            console.error('Identifiants invalides pour la modification :', {
                vehicleId,
                safetyId,
            });
            return false;
        }

        try {
            const url =
                `${API_URL}/update/` +
                `${encodeURIComponent(vehicleId)}/` +
                `${encodeURIComponent(safetyId)}`;

            console.log('Modification du contrôle :', {
                vehicleId,
                safetyId,
                url,
                data,
            });

            const response = await fetch(url, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(data),
            });

            await readResponse(response);

            await getSafetyInspections(vehicleId);

            return true;
        } catch (error) {
            console.error(
                'Erreur lors de la modification du contrôle :',
                error
            );
            return false;
        }
    };

    /**
     * Valide un contrôle technique.
     */
    const validateSafetyInspections = async (
        vehicleId: string,
        safetyId: string,
        data: ValidateSafetyData
    ): Promise<boolean> => {
        if (!hasValidId(vehicleId) || !hasValidId(safetyId)) {
            console.error('Identifiants invalides pour la validation :', {
                vehicleId,
                safetyId,
            });
            return false;
        }

        try {
            const url =
                `${API_URL}/validate/` +
                `${encodeURIComponent(vehicleId)}/` +
                `${encodeURIComponent(safetyId)}`;

            console.log('Validation du contrôle :', {
                vehicleId,
                safetyId,
                url,
                data,
            });

            const response = await fetch(url, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(data),
            });

            await readResponse(response);

            await getSafetyInspections(vehicleId);

            return true;
        } catch (error) {
            console.error(
                'Erreur lors de la validation du contrôle :',
                error
            );
            return false;
        }
    };

    /**
     * Ajoute un contrôle réalisé.
     */
    const safetyInspectionYes = async (
        vehicleId: string,
        doneAt: string
    ): Promise<void> => {
        if (!hasValidId(vehicleId)) {
            console.error('Identifiant du véhicule invalide :', vehicleId);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/addDone/${encodeURIComponent(vehicleId)}`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({ doneAt }),
                }
            );

            await readResponse(response);
            await getSafetyInspections(vehicleId);
        } catch (error) {
            console.error(
                "Erreur lors de l'ajout du contrôle réalisé :",
                error
            );
        }
    };

    /**
     * Crée un contrôle technique non réalisé.
     */
    const safetyInspectionNo = async (
        vehicleId: string
    ): Promise<void> => {
        if (!hasValidId(vehicleId)) {
            console.error('Identifiant du véhicule invalide :', vehicleId);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/addFirst/${encodeURIComponent(vehicleId)}`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );

            await readResponse(response);
            await getSafetyInspections(vehicleId);
        } catch (error) {
            console.error(
                'Erreur lors de la création du contrôle :',
                error
            );
        }
    };

    return (
        <SafetyInspectionContext.Provider
            value={{
                safetyList,
                getSafetyInspections,
                getSafetyInspectionsNotDone,
                safetyInspectionYes,
                safetyInspectionNo,
                updateSafetyInspections,
                validateSafetyInspections,
            }}
        >
            {children}
        </SafetyInspectionContext.Provider>
    );
}

export const useSafety = (): SafetyInspectionContextType => {
    const context = useContext(SafetyInspectionContext);

    if (!context) {
        throw new Error(
            'useSafety doit être utilisé dans un SafetyInspectionProvider.'
        );
    }

    return context;
};
