import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';

const Login: React.FC = () => {
    const { setUsername, setfirst_name, setlast_name } = useUser();
    const [username, setLocalUsername] = useState('');
    const [first_name, setLocalfirst_name] = useState('');
    const [last_name, setLocallast_name] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        setUsername(username);
        setfirst_name(first_name);
        setlast_name(last_name);
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
                value={first_name}
                onChange={(e) => setLocalfirst_name(e.target.value)}
                className={styles.input}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={last_name}
                onChange={(e) => setLocallast_name(e.target.value)}
                className={styles.input}
            />
            <button onClick={handleSubmit} className={styles.submitBtn}>Log In</button>
        </div>
    );
};

export default Login;
