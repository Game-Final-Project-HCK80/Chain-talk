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
        // Cek cookie di client-side
        const cookies = document.cookie.split('; ').find(row => row.startsWith('Authorization='));
        if (cookies) {
            const authToken = cookies.split('=')[1] || '';
            setAuth(authToken);
        }
    }, []);

    return (
        <>
            <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-500 to-pink-500 bg-opacity-90 shadow-lg z-50">
                <div className="container mx-auto relative md:px-0 px-4 bg-transparent rounded-b-xl overflow-hidden">
                    {/* Nav */}
                    <nav className="bg-transparent shadow-lg w-full z-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16">
                                {/* Desktop Menu */}
                                <div className="hidden md:flex space-x-8 text-white">
                                    <Link href="/" className={`${pathname === '/' ? 'text-yellow-300 font-bold' : 'hover:text-yellow-200'}`}>Home</Link>
                                    <Link href="/create-room" className={`${pathname === '/create-room' ? 'text-yellow-300 font-bold' : 'hover:text-yellow-200'}`}>Create Room</Link>
                                    <Link href="/profile" className={`${pathname === '/profile' ? 'text-yellow-300 font-bold' : 'hover:text-yellow-200'}`}>Profile</Link>
                                    <Link href="/leaderboard" className={`${pathname === '/leaderboard' ? 'text-yellow-300 font-bold' : 'hover:text-yellow-200'}`}>Leaderboard</Link>
                                    <Link href="/lobby" className={`${pathname === '/lobby' ? 'text-yellow-300 font-bold' : 'hover:text-yellow-200'}`}>Lobby</Link>
                                    {auth ? <ButtonLogout /> : <Link href="/login" className="hover:text-yellow-200">Login</Link>}
                                </div>
                                {/* Mobile Menu Button */}
                                <div className="md:hidden flex items-center">
                                    <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-yellow-300 focus:outline-none">
                                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {/* Mobile Menu */}
                            {isOpen && (
                                <div className="md:hidden flex flex-col space-y-4 mt-4 text-white">
                                    <Link href="/" className={`${pathname === '/' ? 'text-yellow-300 font-bold' : 'hover:text-yellow-200'}`}>Home</Link>
                                    <Link href="/create-room" className={`${pathname === '/create-room' ? 'text-yellow-300 font-bold' : 'hover:text-yellow-200'}`}>Create Room</Link>
                                    <Link href="/profile" className={`${pathname === '/profile' ? 'text-yellow-300 font-bold' : 'hover:text-yellow-200'}`}>Profile</Link>
                                    <Link href="/leaderboard" className={`${pathname === '/leaderboard' ? 'text-yellow-300 font-bold' : 'hover:text-yellow-200'}`}>Leaderboard</Link>
                                    <Link href="/lobby" className={`${pathname === '/lobby' ? 'text-yellow-300 font-bold' : 'hover:text-yellow-200'}`}>Lobby</Link>
                                    {auth ? <ButtonLogout /> : <Link href="/login" className="hover:text-yellow-200">Login</Link>}
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
            <div className="h-20 bg-white"></div>
        </>
    );
}