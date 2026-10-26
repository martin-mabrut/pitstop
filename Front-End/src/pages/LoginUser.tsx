import React from 'react';
import { useAuth } from '../contexts/AuthProvider';

export default function Login() {
    const { login } = useAuth();

    const handleSubmit = (event) => {
        event?.preventDefault();
        const username = event?.target?.username?.value;
        const password = event?.target?.password?.value;
        login({ username, password });
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>username</p>
                    <input name='username' required />
                </label>
                <label>
                    <p>Password</p>
                    <input type='password' name='password' required />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}