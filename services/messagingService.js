import axios from "axios";
import { USER_URL, CONVERSATION_URL, MESSAGE_URL } from "../constants/Configuration";

const setToken = (token) => {
    return `bearer ${token}`;
}

const deleteConversation = async (userList, token, convo) => {
    //const config = { headers: { Authorization: setToken(token) } };
    const response = await axios.delete(`${CONVERSATION_URL}/${convo}`, {
        headers: { Authorization: setToken(token) },
        data: { users: userList }
    }).catch((err) => { throw err.response });
    return response;
}

const getCurrentConversation = async (data, token) => {
    const config = { headers: { Authorization: setToken(token) } };
    const response = await axios.post(`${CONVERSATION_URL}/open`, data, config)
        .catch(err => { throw err.response });
    return response.data;
}

const startNewConversation = async (data, token) => {
    const config = { headers: { Authorization: setToken(token) } };
    const response = await axios.post(`${CONVERSATION_URL}`, data, config)
        .catch(err => { throw err.response });
    return response.data;
}

const saveMessage = async (data, token, id) => {
    const config = { headers: { Authorization: setToken(token) } };
    const response = await axios.post(`${MESSAGE_URL}/${id}`, data, config)
        .catch(err => { throw err.response });
    return response.data;
}

const refreshScreen = async () => {
    const response = await axios.get(`${CONVERSATION_URL}`).catch(err => { throw err.response; });
    return response.data;
}

export default { deleteConversation, getCurrentConversation, startNewConversation, saveMessage,  refreshScreen };