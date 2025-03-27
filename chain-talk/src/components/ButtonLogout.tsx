'use client'

import { handleLogout } from "@/app/action";





export default function ButtonLogout() {
    return (
        <button
            onClick={() => {
                handleLogout();
                document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                window.location.reload();
            }}
            className="hover:text-yellow-200"
        >
            Logout
        </button>
    );
}
