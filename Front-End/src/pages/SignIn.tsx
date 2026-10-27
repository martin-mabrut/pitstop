import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router";

export default function Signin() {
    const { signin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event?.preventDefault();
        const username = event?.target?.username.value;
        const email = event?.target?.email?.value;
        const password = event?.target?.password?.value;
        signin({ username, password, email });

        navigate("/login");
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>username</p>
                    <input name='username' type='username' required />
                </label>
                <label>
                    <p>email</p>
                    <input name='email' type='email' required />
                </label>
                <label>
                    <p>Password</p>
                    <input type='password' name='password' required />
                </label>
                <br />
                <button type="submit">Sign in</button>
            </form>
        </div>
    )
}