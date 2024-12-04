import React, { createContext, useContext, useState, useEffect } from 'react';
import { makeGetRequest } from '../services/authService';

export type UserContextType = {
    username: string;
    first_name: string;
    last_name: string;
    setUsername: (username: string) => void;
    setfirst_name: (first_name: string) => void;
    setlast_name: (last_name: string) => void;
} | null;

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState('');
    const [first_name, setfirst_name] = useState('');
    const [last_name, setlast_name] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (token && !username) {
            const fetchProfile = async () => {
                try {
                    const response = await makeGetRequest('api/v1/me/');
                    setUsername(response.data.username);
                    setfirst_name(response.data.first_name);
                    setlast_name(response.data.last_name);
                } catch (error) {
                    setUsername('');
                    setfirst_name('');
                    setlast_name('');
                }
            };
            fetchProfile();
        }
    }, [username]);

    return (
        <UserContext.Provider value={{ username, first_name, last_name, setUsername, setfirst_name, setlast_name }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
