import { useEffect, useState } from "react";

export function useWebSocket() {
    const [messages, setMessages] = useState<string[]>([]);
    
    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8008/ws/chat/");

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data.message]);
        };

        return () => socket.close();
    }, []);

    return { messages };
}
