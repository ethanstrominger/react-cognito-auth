import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';

const Login: React.FC = () => {
    const { setUsername, setFirstName, setLastName } = useUser();
    const [username, setLocalUsername] = useState('');
    const [firstName, setLocalFirstName] = useState('');
    const [lastName, setLocalLastName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        setUsername(username);
        setFirstName(firstName);
        setLastName(lastName);
        navigate('/');
    };

    return (
        <div className={styles.loginContainer}>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setLocalUsername(e.target.value)}
                className={styles.input}
            />
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setLocalFirstName(e.target.value)}
                className={styles.input}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLocalLastName(e.target.value)}
                className={styles.input}
            />
            <button onClick={handleSubmit} className={styles.submitBtn}>Log In</button>
        </div>
    );
};

export default Login;
