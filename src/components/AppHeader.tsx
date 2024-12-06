import { useEffect } from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import { makeGetRequest } from '../services/authService';
import { useUser } from '../contexts/UserContext';
import styles from '../styles/App.module.css';


const AppHeader: React.FC = () => {
    const { username, first_name, last_name, setUsername, setfirst_name, setlast_name } = useUser()
    useEffect(() => {
        const token = localStorage.getItem("access_token");

        // Simulate fetching user details if logged in
        if (token && !username) {
            const fetchProfile = async () => {
                try {
                    const response = await makeGetRequest('api/v1/me/');
                    setUsername(response.data.username);
                    setfirst_name(response.data.first_name);
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
    return (

            <div className={styles.appContainer}>
                <header className={styles.header}>
                    <nav className={styles.nav}>
                        <Link to="/">Home</Link>
                        <Link to="/profile">Profile</Link>
                    </nav>
                    <div className={styles.logo}>React Cognito Example</div>
                    <div className={styles.userDetails}>
                        {first_name} {last_name || username}
                    </div>
                </header>
            </div>
    )
};

export default AppHeader;
