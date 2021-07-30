import axios from "axios";
import { USER_URL, CONVERSATION_URL, MESSAGE_URL } from "../constants/Configuration";

const getCurrentConversation = async (data, token) => {
    const config = { headers: { Authorization: token } };
    const response = await axios.post(`${CONVERSATION_URL}/open`, data, config)
        .catch(err => { throw err.response });
    return response.data;
}

export default { getCurrentConversation };