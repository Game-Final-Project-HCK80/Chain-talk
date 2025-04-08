import React from "react";
import { useMouse } from "@/mousecontex/mousecontext";

export default function CustomPointer() {
    const { position, hovering } = useMouse();

    // Bubble count dan array acak
    const bubbles = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        size: Math.random() * 16 + 8, // ukuran 8 - 24px
        offsetX: Math.random() * 180 - 90, // sebaran horizontal
        offsetY: Math.random() * 120 - 60, // sebaran vertikal
        delay: Math.random() * 2, // animasi delay
    }));

    return (
        <div
            className="fixed pointer-events-none z-50 transition-transform duration-75"
            style={{
                transform: `translate(${position.x - 150}px, ${position.y - 90}px)`,
            }}
        >
            {/* Awan utama besar */}
            <div
                className={`w-[300px] h-[180px] blur-3xl opacity-50 animate-wind-blow transition-all duration-300
          ${hovering
                        ? "bg-gradient-to-tr from-yellow-200/50 to-yellow-400/40 scale-110"
                        : "bg-gradient-to-tr from-purple-300/40 to-blue-300/30"
                    }`}
                style={{
                    borderRadius: "70% 30% 30% 70% / 40% 60% 60% 40%",
                    transform: "rotate(-10deg)",
                }}
            ></div>

            {/* Layer belakang sebagai trail */}
            <div
                className={`absolute top-0 left-0 w-[300px] h-[180px] blur-2xl opacity-30 transition-all duration-300
          ${hovering
                        ? "bg-gradient-to-r from-yellow-100/30 to-yellow-300/30 scale-125"
                        : "bg-gradient-to-r from-blue-200/30 to-purple-200/30"
                    }`}
                style={{
                    borderRadius: "60% 40% 40% 60% / 35% 65% 65% 35%",
                    transform: "rotate(-15deg)",
                }}
            ></div>

            {/* Bubble Pointer */}
            {bubbles.map((bubble) => (
                <div
                    key={bubble.id}
                    className="absolute rounded-full bg-white/20 backdrop-blur-sm animate-bubble"
                    style={{
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                        left: `calc(50% + ${bubble.offsetX}px)`,
                        top: `calc(50% + ${bubble.offsetY}px)`,
                        animationDelay: `${bubble.delay}s`,
                    }}
                ></div>
            ))}
        </div>
    );
}
