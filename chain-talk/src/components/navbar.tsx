'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ButtonLogout from './ButtonLogout';

export default function Navbar() {
    const [auth, setAuth] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const cookies = document.cookie.split('; ').find(row => row.startsWith('Authorization='));
        if (cookies) {
            const authToken = cookies.split('=')[1] || '';
            setAuth(authToken);
        }
    }, []);

    const navLinkClass = (path: string) =>
        `${pathname === path
            ? 'text-yellow-300 font-bold drop-shadow-[0_0_5px_#FACC15]'
            : 'hover:text-yellow-300 transition-colors duration-200'
        }`;

    return (
        <>
            <div className="fixed top-0 left-0 w-full backdrop-blur-lg bg-purple-800/30 border-b-2 border-yellow-400/50 shadow-xl z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                    <nav className="flex justify-between items-center h-16">
                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-8 text-white font-medium tracking-wide text-lg">
                            <Link href="/" className={navLinkClass('/')}>Home</Link>
                            <Link href="/play-game" className={navLinkClass('/play-game')}>Play Game</Link>
                            <Link href="/profile" className={navLinkClass('/profile')}>Profile</Link>
                            <Link href="/leaderboard" className={navLinkClass('/leaderboard')}>Leaderboard</Link>
                            <Link href="/lobby" className={navLinkClass('/lobby')}>Lobby</Link>
                            <Link href="/info-rank" className={navLinkClass('/info-rank')}>Rank Info</Link>
                            {auth ? <ButtonLogout /> : <Link href="/login" className="hover:text-yellow-300">Login</Link>}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-white hover:text-yellow-300 focus:outline-none transition duration-200"
                            >
                                <svg
                                    className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                        </div>
                    </nav>

                    {/* Mobile Menu */}
                    {isOpen && (
                        <div className="md:hidden mt-4 space-y-4 text-white flex flex-col text-base font-medium">
                            <Link href="/" className={navLinkClass('/')}>Home</Link>
                            <Link href="/play-game" className={navLinkClass('/play-game')}>Play Game</Link>
                            <Link href="/profile" className={navLinkClass('/profile')}>Profile</Link>
                            <Link href="/leaderboard" className={navLinkClass('/leaderboard')}>Leaderboard</Link>
                            <Link href="/lobby" className={navLinkClass('/lobby')}>Lobby</Link>
                            <Link href="/info-rank" className={navLinkClass('/info-rank')}>Rank Info</Link>
                            {auth ? <ButtonLogout /> : <Link href="/login" className="hover:text-yellow-300">Login</Link>}
                        </div>
                    )}
                </div>
            </div>

            {/* Spacer untuk offset Navbar */}
            <div className="h-20" />
        </>
    );
}
