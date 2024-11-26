// src/components/Callback.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '../services/authService';

const Callback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // const params = new URLSearchParams(window.location.search);
        // const code = params.get('code');
       const urlxx = window.location
        const params1xx = new URLSearchParams(urlxx.search);
        params1xx.forEach((value, key) => {
            console.log(`final test ${key}: ${value}`);  // Output: foo: 1, bar: 2
        });
        const code = params1xx.get("code")




        if (code) {
            console.log('code', code)
            exchangeCodeForToken(code).catch((error) => {
                console.error('Exchange failed:', error);
                navigate('/'); // Redirect to home on failure
            });
        } else {
            console.error('No code found in URL');
            navigate('/'); // Redirect if no code is present
        }
    }, [navigate]);

    return <div>Processing login...</div>;
};

export default Callback;
