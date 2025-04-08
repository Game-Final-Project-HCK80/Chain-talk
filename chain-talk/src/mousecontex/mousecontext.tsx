// filepath: c:\Users\LENOVO\Documents\hacktive8\phase 3\Chain-talk\chain-talk\src\mousecontex\mousecontext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface MouseContextType {
    position: { x: number; y: number };
    hovering: boolean;
    setHovering: (hovering: boolean) => void;
}

const MouseContext = createContext<MouseContextType | undefined>(undefined);

export const MouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <MouseContext.Provider value={{ position, hovering, setHovering }}>
            {children}
        </MouseContext.Provider>
    );
};

export const useMouse = () => {
    const context = useContext(MouseContext);
    if (!context) {
        throw new Error("useMouse must be used within a MouseProvider");
    }
    return context;
};