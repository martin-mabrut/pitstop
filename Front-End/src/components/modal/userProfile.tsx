import { useState } from 'react';
import { useUser } from '../../contexts/UserProvider';
import Modal from './modal';

interface UserProfileProps {
    onClose: () => void;
}

export default function UserProfile({ onClose }: UserProfileProps) {
    const { user, updateUsername, updateEmail, updatePassword } = useUser();
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
        event.preventDefault();
        setError('');
        const form = new FormData(event.currentTarget);

        const username = form.get('username') as string;
        const email = form.get('email') as string;
        const oldPassword = form.get('oldPassword') as string;
        const newPassword = form.get('newPassword') as string;
        const confirmPassword = form.get('confirmPassword') as string;

        // vérifications du mot de passe avant tout envoi
        if (newPassword) {
            if (!oldPassword) {
                setError('Entre ton mot de passe actuel pour le modifier.');
                return;
            }
            if (newPassword !== confirmPassword) {
                setError('Les deux nouveaux mots de passe ne correspondent pas.');
                return;
            }
        }

        // une requête par champ modifié
        if (username !== user?.username) {
            const result = await updateUsername(username);
            if (!result.ok) {
                setError(result.message ?? 'Erreur');
                return;
            }
        }

        if (email !== user?.email) {
            const result = await updateEmail(email);
            if (!result.ok) {
                setError(result.message ?? 'Erreur');
                return;
            }
        }

        if (newPassword) {
            const result = await updatePassword(oldPassword, newPassword);
            if (!result.ok) {
                setError(result.message ?? 'Erreur');
                return;
            }
        }

        setEditing(false);
    }

    if (!editing) {
        return (
            <Modal title="Mon profil" onClose={onClose}>
                <p><strong>Nom d'utilisateur :</strong> {user?.username}</p>
                <p><strong>Email :</strong> {user?.email}</p>
                <p><strong>Mot de passe :</strong> ••••••••</p>
                <div className="modal-pitstop__actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Fermer</button>
                    <button type="button" className="btn btn-success" onClick={function () { setEditing(true); }}>
                        Modifier
                    </button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal title="Modifier mon profil" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <label className="form-label w-100 mb-3">
                    Nom d'utilisateur
                    <input name="username" defaultValue={user?.username} className="form-control mt-1" required />
                </label>
                <label className="form-label w-100 mb-3">
                    Email
                    <input name="email" type="email" defaultValue={user?.email} className="form-control mt-1" required />
                </label>

                <hr />
                <p className="mb-2"><strong>Changer le mot de passe</strong> (laisse vide pour le garder)</p>
                <label className="form-label w-100 mb-3">
                    Mot de passe actuel
                    <input name="oldPassword" type="password" autoComplete="current-password" className="form-control mt-1" />
                </label>
                <label className="form-label w-100 mb-3">
                    Nouveau mot de passe
                    <input name="newPassword" type="password" autoComplete="new-password" className="form-control mt-1" />
                </label>
                <label className="form-label w-100 mb-3">
                    Confirmer le nouveau mot de passe
                    <input name="confirmPassword" type="password" autoComplete="new-password" className="form-control mt-1" />
                </label>

                {error && <p className="text-danger">{error}</p>}

                <div className="modal-pitstop__actions">
                    <button type="button" className="btn btn-secondary" onClick={function () { setEditing(false); setError(''); }}>
                        Annuler
                    </button>
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                </div>
            </form>
        </Modal>
    );
}