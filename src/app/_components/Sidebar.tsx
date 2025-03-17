'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Trash } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import '@/app/styles/globals.css'
import useCreateChat from "@/app/_hooks/createNewChat";
import logo from '@/app/_public/logo1.png';

const Sidebar: FC = () => {
    const pathname = usePathname();
    const [chats, setChats] = useState([]);
    const [hoveredChatId, setHoveredChatId] = useState<number | null>(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const { createChat, loading, error } = useCreateChat();
    const [chatId, setChatId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [chatToDelete, setChatToDelete] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8008/api/v1/chats/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setChats(response.data.reverse());
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };

        fetchChats();
    }, [token]);

    const handleNewChat = async () => {
        const chatUuid = await createChat();
        if (chatUuid) {
            setChatId(chatUuid);
        }
    };

    useEffect(() => {
        if (chatId) {
            router.push(`/chat/${chatId}`);
            setTimeout(() => {
                window.location.reload();
                console.log('Router work');
            }, 500);
        }
    }, [chatId, router]);

    const handleDeleteClick = (chatId: number) => {
        setShowModal(true);
        setChatToDelete(chatId);
    };

    const handleDeleteConfirm = async () => {
        console.log(chatToDelete);
        
        if (chatToDelete !== null) {
            try {
                await axios.delete(`http://127.0.0.1:8008/api/v1/chats/${chatToDelete}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setChats(chats.filter(chat => chat.id !== chatToDelete));
                setShowModal(false);
                router.push('/')
            } catch (error) {
                console.error("Error deleting chat:", error);
            }
        }
    };

    const handleDeleteCancel = () => {
        setShowModal(false);
        setChatToDelete(null);
    };

    const handleGoToHome = () => {
        router.push('/')
    }

    const hiddenRoutes = ["/log-in", "/sign-up"];
    if (hiddenRoutes.includes(pathname)) return null;

    return (
        <div className="fixed left-0 top-0 h-full w-72 p-3 bg-black/15">
            <button onClick={handleGoToHome}>
                <div className="flex gap-2 ml-3 my-1">
                    <img src={logo.src} alt="Logo" width={75} height={75} />
                    <h1 className="m-auto -ml-1 text-[2rem] text-white/75 logo">Donkey AI</h1>
                </div>
            </button>
            <div className="flex justify-center mt-5 mb-5">
                <button onClick={handleNewChat} disabled={loading} className='p-1 w-full bg-light rounded-lg hover:bg-dark transition-all'>New chat</button>
            </div>
            <ul className="flex-col justify-normal sidebar-buttons mt-2 border-t border-light">
                {chats.length === 0 ? (
                    <li className="mt-2 px-4 py-2 text-gray-500">No chats available</li>
                ) : (
                    chats.map((chat) => (
                        <li
                            key={chat.id}
                            className={`flex items-center justify-between gap-2 mt-2 px-4 py-2 rounded-md transition ${
                                pathname === `/chat/${chat.chat_id}` ? "bg-white/15 text-white" : "hover:bg-white/10"
                            }`}
                            onMouseEnter={() => setHoveredChatId(chat.id)}
                            onMouseLeave={() => setHoveredChatId(null)}>
                            <Link href={`/chat/${chat.chat_id}`} className="flex-1 p-2">{`Chat ${chat.chat_id.slice(-12)}`}</Link>
                            {hoveredChatId === chat.id && (
                                <button onClick={() => handleDeleteClick(chat.id)} className='transition-all'>
                                    <Trash className='w-7 h-7 hover:bg-white/10 rounded-full transition-all p-1'/>
                                </button>
                            )}
                        </li>
                    ))
                )}
            </ul>
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-150">
                    <div className="bg-gray p-5 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl mb-4">Are you sure you want to delete this chat?</h2>
                        <div className="flex justify-around">
                            <button onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600 transition-all text-white p-2 rounded-lg w-24">Delete</button>
                            <button onClick={handleDeleteCancel} className="bg-gray-300 p-2 rounded-lg w-24 hover:bg-black/20 transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
