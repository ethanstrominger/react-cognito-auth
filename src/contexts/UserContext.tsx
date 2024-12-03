import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface UserContextType {
    username: string;
    firstName: string;
    lastName: string;
    setUsername: (username: string) => void;
    setFirstName: (firstName: string) => void;
    setLastName: (lastName: string) => void;
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
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    useEffect(() => {
        console.log("UserProvider mounted");
        return () => console.log("UserProvider unmounted");
    }, []);


    return (
        <UserContext.Provider value={{ username, firstName, lastName, setUsername, setFirstName, setLastName }}>
            {children}
        </UserContext.Provider>
    );
};
