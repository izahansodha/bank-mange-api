import axios from "axios";

const API_URL = "https://localhost:7191/api/AI";

export const sendMessage = async (message, token) => {
  const response = await axios.post(
    `${API_URL}/chat`,
    {
      message: message,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};  