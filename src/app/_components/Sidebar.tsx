'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Sidebar() {
    const pathname = usePathname();
    const [chats, setChats] = useState([]);
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8008/api/v1/chats/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setChats(response.data);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };

        fetchChats();
    }, [token]);

    const hiddenRoutes = ["/log-in", "/sign-up"];
    if (hiddenRoutes.includes(pathname)) return null;

    return (
        <div className="fixed left-0 top-0 h-full w-72 p-3 bg-black/15">
            <div className="ml-3 my-10">
            </div>
            <div className="flex justify-center mt-5 mb-5">
                <button className='p-1 w-full bg-light rounded-lg hover:bg-dark transition-all'>New chat</button>
            </div>
            <ul className="flex-col justify-normal sidebar-buttons mt-2 border-t border-light">
                {chats.length === 0 ? (
                    <li className="mt-2 px-4 py-2 text-gray-500">No chats available</li>
                ) : (
                    chats.map((chat) => (
                        <li
                            key={chat.chat_id}
                            className={`flex gap-2 mt-2 px-4 py-2 rounded-md transition ${
                                pathname === `/chat/${chat.chat_id}` ? "bg-white/15 text-white" : "hover:bg-white/10"
                            }`}
                        >
                            <Link href={`/chat/${chat.chat_id}`}>{`Chat ${chat.chat_id}`}</Link>
                            <button className='transition-all'><Trash className='w-7 h-7 hover:bg-light rounded-full transition-all p-1'/></button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
