import { useContext, createContext, useState, type ReactNode } from 'react';

export interface User {
    username: string;
    uuid: string;
    email: string;
}

interface UpdateResult {
    ok: boolean;
    message?: string;
}

interface UserContextType {
    user: User | null;
    getUser: () => Promise<void>;
    updateUsername: (username: string) => Promise<UpdateResult>;
    updateEmail: (email: string) => Promise<UpdateResult>;
    updatePassword: (oldPassword: string, newPassword: string) => Promise<UpdateResult>;
}

const API_URL = 'http://localhost:8000/api/user';

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);

    async function getUser() {
        try {
            const response = await fetch(API_URL, {
                credentials: 'include',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                setUser(await response.json());
            }
        } catch (error) {
            console.log(error);
        }
    }

    // PATCH commun aux trois routes : le back renvoie une réponse vide si OK,
    // et un texte (message d'erreur) sinon
    async function patchUser(path: string, body: object): Promise<UpdateResult> {
        try {
            const response = await fetch(`${API_URL}/${path}`, {
                credentials: 'include',
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                return { ok: true };
            }
            const text = await response.text();
            return { ok: false, message: text || 'Une erreur est survenue' };
        } catch (error) {
            console.log(error);
            return { ok: false, message: 'Serveur injoignable' };
        }
    }

    async function updateUsername(username: string) {
        const result = await patchUser('username', { username: username });
        if (result.ok) await getUser();
        return result;
    }

    async function updateEmail(email: string) {
        const result = await patchUser('email', { email: email });
        if (result.ok) await getUser();
        return result;
    }

    async function updatePassword(oldPassword: string, newPassword: string) {
        return patchUser('password', { oldPassword: oldPassword, newPassword: newPassword });
    }

    return (
        <UserContext.Provider value={{ user, getUser, updateUsername, updateEmail, updatePassword }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser doit être utilisé dans un UserProvider');
    }
    return context;
}