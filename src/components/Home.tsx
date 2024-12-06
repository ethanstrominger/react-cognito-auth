import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import styles from '../styles/Home.module.css';
import { makeGetRequest, redirectToLogin } from '../services/authService';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { username, setUsername, first_name, last_name, setfirst_name, setlast_name } = useUser();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        setIsLoggedIn(!!token);

        // Simulate fetching user details if logged in
        if (token && !username) {
            const fetchProfile = async () => {
                try {
                    console.log("setting first_name, last_name")
                    const response = await makeGetRequest('api/v1/me/');
                    setUsername(response.data.username);
                    setfirst_name(response.data.first_name);
                    console.log(username, first_name, last_name )
                    setlast_name(response.data.last_name)
                } catch (error) {
                    setfirst_name(""); // Replace with actual fetch call
                    setlast_name("");   // Replace with actual fetch call
                    setUsername(""); // Replace with actual fetch call
                }
            };
            fetchProfile();


        }
    }, [username, first_name, last_name, setfirst_name, setlast_name, setUsername]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
        setfirst_name("");
        setlast_name("");
        setUsername("");
        navigate("/");
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
