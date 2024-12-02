import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

const API_SERVER_URL = process.env.REACT_APP_API_SERVER_URL;

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = `${API_SERVER_URL}api/v1/login/`;
            const response = await axios.post(url, {
                username,
                password,
            });
            localStorage.setItem("access_token", response.data.token);
            window.location.href = "/";
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Login</h1>
            <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">
                    Login
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Login;
