"use client";

import { useState, useEffect } from "react";
import { LogOut, User } from "lucide-react";
import {usePathname, useRouter} from "next/navigation";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {router} from "next/client";

const Profile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState("Loading...");
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) return;

            try {
                const decodedToken = jwtDecode<{ user_id: string }>(token);
                const userId = decodedToken.user_id;

                const response = await axios.get(`http://127.0.0.1:8008/api/v1/users/${userId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUsername(response.data.username);

            } catch (error) {
                console.error("Error fetching user data:", error);
                setUsername("Unknown");
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        setIsOpen(false)
        localStorage.removeItem("access_token");
        router.push('/log-in')
    };

    useEffect(() => {
        if (!username) {
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    }, [username, router]);

    const hiddenRoutes = ["/log-in", "/sign-up"];
    if (hiddenRoutes.includes(pathname)) return null;

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700 transition">
                    <User className="w-5 h-5" />
                    {username}
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white/10 hover:bg-white/25 transition-all shadow-lg rounded-md">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100">
                            <LogOut className="w-4 h-4" />
                            Log Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
