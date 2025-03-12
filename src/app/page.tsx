'use client';

import { FC, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ArrowUp } from "lucide-react";
import { PlusCircleIcon } from "lucide-react";

const Home: FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ sender: string, content: string, timestamp: string }[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const getChatHistory = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://127.0.0.1:8008/api/v1/response/get_history/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(res.data.history);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const getOllamaResponse = async (prompt: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.post('http://127.0.0.1:8008/api/v1/response/', { prompt }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse(res.data.response);
      getChatHistory();
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponse('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (prompt.trim() !== '') {
      getOllamaResponse(prompt);
      setPrompt('');
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
    getChatHistory();
  }, []);

  return (
    <main className="bg-bg w-full h-full flex flex-col items-center justify-between p-4">
      <div className="chat flex-1 flex flex-col items-start w-full max-w-3xl mt-10">
        <div className="chat-history w-full flex flex-col space-y-5 mb-32">
          {history.map((msg, index) => (
            <div
              key={index}
              className={`message flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'} w-full`}>
              <div
                className={`message-bubble p-3 max-w-lg rounded-lg ${
                  msg.sender === 'User' ? 'bg-light text-white rounded-br-none' : 'bg-white/5 text-black'
                }`}>
                <p className="whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-3xl flex items-center fixed bottom-0 bg-bg h-[5.4rem]">
        <div
          className="w-full max-w-3xl flex gap-3 items-center p-2 px-10 border border-light/50 fixed bottom-0 rounded-3xl bg-gray mb-7 shadow-light/15 shadow-lg">
          <button
            onClick={handleSubmit}
            className="submit text-white py-2 px-4 rounded-full hover:bg-dark transition-all duration-200 w-10">
            <PlusCircleIcon />
          </button>
          <textarea
              ref={textareaRef}
              placeholder="Ask anything you want"
              className="flex-1 text-white outline-none bg-transparent focus:transform-none resize-none overflow-auto max-h-40 h-auto scrollbar-thin transition-all"
              value={prompt}
              onChange={handleTextChange}
              rows={1}
          />
          <button
              onClick={handleSubmit}
              className="submit bg-light text-white py-2 px-4 rounded-full hover:bg-dark transition-all duration-200 w-10">
            <ArrowUp/>
          </button>
        </div>
        <div className="mt-14 mx-auto">
          <p className='text-xs text-white/25'>Donkey AI can make mistakes, because he's donkey</p>
        </div>
      </div>
    </main>
  );
};

export default Home;
