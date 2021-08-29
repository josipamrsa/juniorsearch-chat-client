//----KONFIGURACIJA----//
import axios from "axios";

import {    
    CONVERSATION_URL, 
    MESSAGE_URL 
} from "../constants/Configuration";

//----METODE----//

// Postavljanje tokena
const setToken = (token) => {
    return `bearer ${token}`;
}

// Brisanje razgovora sa korisnikom
const deleteConversation = async (userList, token, convo) => {
    const response = await axios.delete(`${CONVERSATION_URL}/${convo}`, {
        headers: { Authorization: setToken(token) },
        data: { users: userList }
    }).catch((err) => { throw err.response });
    return response;
}

// Dohvat postojećeg razgovora
const getCurrentConversation = async (data, token) => {
    const config = { headers: { Authorization: setToken(token) } };
    const response = await axios.post(`${CONVERSATION_URL}/open`, data, config)
        .catch(err => { throw err.response });
    return response.data;
}

// Pokretanje novog razgovora
const startNewConversation = async (data, token) => {
    const config = { headers: { Authorization: setToken(token) } };
    const response = await axios.post(`${CONVERSATION_URL}`, data, config)
        .catch(err => { throw err.response });
    return response.data;
}

// Spremanje poruke u trenutnu razgovor
const saveMessage = async (data, token, id) => {
    const config = { headers: { Authorization: setToken(token) } };
    const response = await axios.post(`${MESSAGE_URL}/${id}`, data, config)
        .catch(err => { throw err.response });
    return response.data;
}

export default { 
    deleteConversation, 
    getCurrentConversation, 
    startNewConversation, 
    saveMessage 
}