import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface UserContextType {
    username: string;
    first_name: string;
    last_name: string;
    setUsername: (username: string) => void;
    setfirst_name: (first_name: string) => void;
    setlast_name: (last_name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState('');
    const [first_name, setfirst_name] = useState('');
    const [last_name, setlast_name] = useState('');
    

    return (
        <UserContext.Provider value={{ username, first_name, last_name, setUsername, setfirst_name, setlast_name }}>
            {children}
        </UserContext.Provider>
    );
};
