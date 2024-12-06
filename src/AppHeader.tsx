import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/App.module.css';
import { useUser } from './contexts/UserContext';

const AppHeader: React.FC = () => {
    // const { username, first_name, last_name } = useUser(); // Get setters from UserContext
    const user = useUser();
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <Link to="/">Home</Link>
                <Link to="/profile">Profile</Link>
            </nav>
            <div className={styles.logo}>React Cognito Example</div>
            <div className={styles.userDetails}>
                {user.first_name} {user.last_name || user.username}
            </div>
        </header>
    );
};

export default AppHeader;
