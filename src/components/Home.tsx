import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Home.module.css';
import { redirectToLogin } from '../services/authService';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userDetails, setUserDetails] = useState({ firstName: "", lastName: "" });

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        setIsLoggedIn(!!token);

        // Simulate fetching user details if logged in
        if (token) {
            const user = {
                firstName: "John", // Replace with actual fetch call
                lastName: "Doe",   // Replace with actual fetch call
            };
            setUserDetails(user);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
        setUserDetails({ firstName: "", lastName: "" });
        navigate("/");
    };

    const handleLogin = () => {
        redirectToLogin();
    };

    return (
        <div className={styles.container}>
            {/* User Details in Upper Right */}
            {isLoggedIn && (
                <div className={styles.userDetails}>
                    {userDetails.firstName} {userDetails.lastName}
                </div>
            )}

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
