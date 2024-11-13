import React, { createContext, useContext, useState } from 'react';

const SharedContext = createContext();

export const SharedProvider = ({ children }) => {
    const [activeLink, setActiveLink] = useState('Dashboard');
    const [activeP, setActiveP] = useState('');

    return (
        <SharedContext.Provider value={{
            activeP,
            setActiveP,
            activeLink,
            setActiveLink
        }}>
            {children}
        </SharedContext.Provider>
    );
};

export const useShared = () => useContext(SharedContext);