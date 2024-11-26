import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the access token from localStorage
        localStorage.removeItem("access_token");

        // Optionally navigate the user to the login page (or any other page)
        navigate("/");
    };



    return (
        <div>
            <h1>Home Screen</h1>
            <button onClick={() => navigate('/projects')}>Go to Projects</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;
