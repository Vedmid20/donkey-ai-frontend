'use client';

import { FC, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowUp } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import UnknownChat from "@/app/_components/UnknownChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import logo from '@/app/_public/logo1.png';

const Chat: FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ sender: string, content: string, timestamp: string, loading?: boolean }[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [chatExists, setChatExists] = useState<boolean>(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const pathname = usePathname();
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const chatId = pathname.slice(6);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error("Error jwt decoding:", error);
      }
    }
  }, []);

  useEffect(() => {
    const getChats = async () => {
      const res = await axios.get('http://127.0.0.1:8008/api/v1/chats/', {
        headers: { Authorization: `Bearer ${token}` },
        params: { chat_id: chatId }
      });
      setChats(res.data);
    };
    if (token) {
      getChats();
    }
  }, [token]);

  useEffect(() => {
    const chat = chats.find(c => c.chat_id === chatId && c.owner === userId);
    setChatExists(!!chat);
  }, [pathname, chats, userId]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [history]);

  const getChatHistory = async () => {
    try {
      if (!token) return;
      const res = await axios.get(`http://127.0.0.1:8008/api/v1/response/get_history/?chat_id=${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { chat: chatId }
      });
      setHistory(res.data.history);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  useEffect(() => {
    const socket = new WebSocket(`ws://127.0.0.1:8008/ws/chat/?token=${token}`);
    socket.onopen = () => console.log('WebSocket connected');
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setHistory((prev) =>
        prev.map((msg) =>
          msg.loading ? { ...msg, content: data.response, loading: false } : msg
        )
      );
    };
    socket.onclose = () => console.log('WebSocket disconnected');
    socket.onerror = (error) => console.error('WebSocket error:', error);

    setWs(socket);
  }, [token]);

  const handleSubmit = () => {
    if (!prompt.trim()) return;

    const newMessage = { sender: 'User', content: prompt, timestamp: new Date().toISOString() };
    setHistory((prev) => [...prev, newMessage]);

    setHistory((prev) => [
      ...prev,
      { sender: 'AI', content: '', timestamp: new Date().toISOString(), loading: true }
    ]);

    sendOllamaRequest(prompt);
    setPrompt('');
  };

  const sendOllamaRequest = async (prompt: string) => {
    try {
      if (!token) return;
      const res = await axios.post('http://127.0.0.1:8008/api/v1/response/', { prompt }, {
        headers: { Authorization: `Bearer ${token}` },
        params: { chat_id: chatId }
      });

      setHistory((prev) =>
        prev.map((msg) =>
          msg.loading ? { ...msg, content: res.data.response, loading: false } : msg
        )
      );
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrompt(value);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (chatExists) {
      getChatHistory();
    }
  }, [chatExists]);

  if (!chatExists) {
    return <UnknownChat />
  }

  return (
    <main className="bg-bg w-full h-full flex flex-col items-center justify-between p-4">
      <title>Chat</title>
      <div className="chat flex-1 flex flex-col items-start w-full max-w-3xl mt-10">
        <div className="chat-history w-full flex flex-col space-y-10 mb-32">
          {history.map((msg, index) => (
            <div key={index} className={`message flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'} w-full`}>
              <div className={`message-bubble p-3 max-w-lg rounded-lg ${
                msg.sender === 'User' ? 'bg-light text-white rounded-br-none' : 'bg-white/5 text-black'
              }`}>
                {msg.loading ? (
                  <img src={logo.src} alt="Loading..." className="w-10 h-10 animate-pulse" />
                ) : (
                  <h5 className="whitespace-pre-line font-extralight">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </h5>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>
      </div>
      <div className="w-full max-w-3xl flex items-center fixed bottom-0 bg-bg h-[5.4rem] z-10">
        <div className="w-full max-w-3xl flex gap-3 items-center p-2 px-10 border border-light/50 fixed bottom-0 rounded-3xl bg-gray mb-7 shadow-light/15 shadow-lg">
          <textarea
            ref={textareaRef}
            placeholder="Ask anything you want"
            className="flex-1 text-white outline-none bg-transparent focus:transform-none resize-none overflow-auto max-h-40 h-auto scrollbar-thin transition-all"
            value={prompt}
            onChange={handleTextChange}
            rows={1}/>
          <button type='submit' onClick={handleSubmit} className="submit bg-light text-white py-2 px-4 rounded-full hover:bg-dark transition-all duration-200 w-10">
            <ArrowUp />
          </button>
        </div>
      </div>
    </main>
  );
};

export default Chat;
