import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import styles from '../styles/Home.module.css';
import { redirectToLogin } from '../services/authService';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { username, setUsername, setfirst_name, setlast_name } = useUser();
    const token = localStorage.getItem("access_token");
    const isLoggedIn = !!token && !!username;
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setfirst_name("");
        setlast_name("");
        setUsername("");
    };

    const handleLogin = () => {
        redirectToLogin();
    };

    return (
        <div className={styles.container}>
            {/* User Details in Upper Right */}

            <h1 className={styles.header}>Home Screen</h1>

            {/* Navigation Buttons */}
            <div className={styles.buttonContainer}>
                <button onClick={() => navigate('/profile')} className={styles.button}>
                    Go to Profile
                </button>
                {isLoggedIn ? (
                    <button onClick={handleLogout} className={styles.button}>
                        Logout
                    </button>
                ) : (
                    <button onClick={handleLogin} className={styles.button}>
                        Log In
                    </button>
                )}
            </div>
        </div>
    );
};

export default Home;
