"use client"
import { createContext, useState, useContext, ReactNode } from "react";

// Define the types for the context value
interface PageRedirectContextType {
    BackArrowLink: string;
    setBackArrowLink: (link: string) => void;

    ForwardArrowLink: string;
    setForwardArrowLink: (link: string) => void;
}

// Define the props for the provider component
interface PageRedirectProviderProps {
    children: ReactNode;
}

export const PageRedirectContext = createContext<PageRedirectContextType | undefined>(undefined);

export const PageRedirectProvider = ({ children }: PageRedirectProviderProps) => {
    const [BackArrowLink, setBackArrowLink] = useState<string>('/');
    const [ForwardArrowLink, setForwardArrowLink] = useState<string>('/');
    
    const contextValue: PageRedirectContextType = {
        BackArrowLink,
        setBackArrowLink,
        ForwardArrowLink,
        setForwardArrowLink
    };
    
    return (
        <PageRedirectContext.Provider value={contextValue}>
            {children}
        </PageRedirectContext.Provider>
    );
};

export const usePageRedirect = () => {
    const context = useContext(PageRedirectContext);
    if (context === undefined) {
        throw new Error('usePageRedirect must be used within a PageRedirectProvider');
    }
    return context;
}; 