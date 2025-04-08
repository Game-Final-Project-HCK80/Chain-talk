// Navbar.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Volume2, VolumeX } from 'lucide-react';
import ButtonLogout from './ButtonLogout';

export default function Navbar() {
    const [auth, setAuth] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const cookies = document.cookie.split('; ').find(row => row.startsWith('Authorization='));
        if (cookies) {
            const authToken = cookies.split('=')[1] || '';
            setAuth(authToken);
        }

        // Setup audio
        const audio = new Audio('/sound/bgm.mp3');
        audio.loop = true;
        audio.volume = 0.5;
        audioRef.current = audio;

        return () => {
            audio.pause();
        };
    }, []);

    const handleNavClick = () => {
        if (audioRef.current && audioRef.current.paused && !isMuted) {
            audioRef.current.play().catch(() => {
                console.warn("Autoplay blocked until user interaction.");
            });
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;

        if (isMuted) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
        setIsMuted(!isMuted);
    };

    const navLink = (href: string, label: string) => (
        <Link href={href} onClick={handleNavClick} className={pathname === href
            ? 'text-yellow-300 font-bold drop-shadow-[0_0_5px_#FACC15]'
            : 'hover:text-yellow-300 transition-colors duration-200'}>
            {label}
        </Link>
    );

    return (
        <>
            <div className="fixed top-0 left-0 w-full backdrop-blur-lg bg-purple-800/30 border-b-2 border-yellow-400/50 shadow-xl z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                    <nav className="flex justify-between items-center h-16">
                        <div className="hidden md:flex space-x-8 text-white font-medium tracking-wide text-lg">
                            {navLink('/', 'Home')}
                            {navLink('/play-game', 'Play Game')}
                            {navLink('/profile', 'Profile')}
                            {navLink('/leaderboard', 'Leaderboard')}
                            {navLink('/lobby', 'Lobby')}
                            {navLink('/info-rank', 'Rank Info')}
                            {auth
                                ? <ButtonLogout />
                                : <Link href="/login" className="hover:text-yellow-300">Login</Link>}
                        </div>

                        <div className="md:flex items-center space-x-4">
                            <button onClick={toggleMute} className="text-white hover:text-yellow-300">
                                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                            </button>
                        </div>
                    </nav>
                </div>
            </div>

            <div className="h-20" />
        </>
    );
}
