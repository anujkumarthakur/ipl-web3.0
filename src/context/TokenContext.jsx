// src/context/TokenContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create the context
const TokenContext = createContext();

// Provide the context to components
export const TokenProvider = ({ children }) => {
    const [balance, setBalance] = useState(1000); // Initial token balance

    // Function to update balance (positive for win, negative for loss)
    const updateBalance = (amount) => {
        setBalance((prevBalance) => prevBalance + amount);
    };

    return (
        <TokenContext.Provider value={{ balance, updateBalance }}>
            {children}
        </TokenContext.Provider>
    );
};

// Custom hook to use the token context
export const useToken = () => {
    return useContext(TokenContext);
};
