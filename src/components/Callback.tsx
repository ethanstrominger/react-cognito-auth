// src/components/Callback.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '../services/authService';

const Callback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // const params = new URLSearchParams(window.location.search);
        // const code = params.get('code');
        // console.log("Call back 5", params);
        // console.log(window.location.href, 'x', window.location, 'x', window.location.search);
        // const url = new URL("https://example.com?foo=1&bar=2");
        // const params1 = new URLSearchParams(url.search);
        // params1.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);  // Output: foo: 1, bar: 2
        // });
        // console.log("foo", params1.get("foo"))
        // const urlx = new URL("http://localhost:3000/callback?code=1794d489-3332-48b3-b94b-f2d0799ee9c5");
        // const params1x = new URLSearchParams(urlx.search);
        // params1x.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);  // Output: foo: 1, bar: 2
        // });        
        // console.log("xxx-code", params1x.get("code"))
       const urlxx = window.location
        const params1xx = new URLSearchParams(urlxx.search);
        params1xx.forEach((value, key) => {
            console.log(`final test ${key}: ${value}`);  // Output: foo: 1, bar: 2
        });
        console.log("xxx-final-code", params1xx.get("code"))
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
