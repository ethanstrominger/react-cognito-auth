import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Home.module.css'; // Import CSS module

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the access token from localStorage
        localStorage.removeItem('access_token');

        // Navigate the user to the login page or home
        navigate('/');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome to the Home Screen</h1>
            <div className={styles.buttonGroup}>
                <button className={styles.button} onClick={() => navigate('/profile')}>
                    Go to Profile
                </button>
                <button className={`${styles.button} ${styles.logoutButton}`} onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Home;
