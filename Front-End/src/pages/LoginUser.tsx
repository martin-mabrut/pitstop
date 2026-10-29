import React from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthProvider";
import "./Auth.css";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event?.preventDefault();
        const username = event?.target?.username?.value;
        const password = event?.target?.password?.value;
        const success = await login({ username, password });
        if (success) {
            navigate("/dashboard");
        }
    }
    return (
        <div className="container auth-page">
            <div className="auth-card">
                <h1 className="auth-card__title">CONNEXION</h1>
                <form onSubmit={handleSubmit}>
                    <label className="form-label w-100 mb-3">
                        Nom d'utilisateur
                        <input name='username' className="form-control mt-1" required />
                    </label>
                    <label className="form-label w-100 mb-4">
                        Mot de passe
                        <input type='password' name='password' className="form-control mt-1" required />
                    </label>
                    <button type="submit" className="btn btn-success w-100">Se connecter</button>
                </form>
                <p className="auth-card__switch">
                    Pas encore de compte ? <Link to="/signin">S'inscrire</Link>
                </p>
            </div>
        </div>
    )
}
