import React from 'react';
import { useAuth } from '../contexts/AuthProvider';

export default function Login() {
    const { login } = useAuth();

    const handleSubmit = (event) => {
        event?.preventDefault();
        const email = event?.target?.email?.value;
        const password = event?.target?.password?.value;
        login({ email, password });
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>email</p>
                    <input name='email' type='email' required />
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