import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const useCreateChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createChat = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const decoded: any = jwtDecode(token);
      const userId = decoded?.user_id;
      if (!userId) throw new Error("Invalid token");

      const response = await axios.post(
        "http://127.0.0.1:8008/api/v1/chats/",
        { owner: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data.chat_id;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create chat");
      console.error("Error creating chat:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createChat, loading, error };
};

export default useCreateChat;
