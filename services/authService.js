//----KONFIGURACIJA----//
import axios from 'axios';

import { 
    USER_URL, 
    CONVERSATION_URL 
} from '../constants/Configuration';

//----METODE----//
let token = null;   // Svojstvo za spremanje tokena

// Postavljanje tokena
const setToken = newToken => {
    token = `bearer ${newToken}`;
}

// Dohvat korisničkih podataka
const fetchUserData = async phone => {
    const config = { headers: { Authorization: token } };
    const response = await axios.get(`${CONVERSATION_URL}/${phone}`, config);
    return response.data;
}

// Postavljanje online statusa korisnika
const setOnlineStatus = async (phone, data) => {
    const config = { headers: { Authorization: token } };
    const response = await axios.put(`${USER_URL}/online/${phone}`, data, config)
        .catch(err => { throw err.response });
    return response.data;
}

export default { 
    setToken, 
    fetchUserData, 
    setOnlineStatus 
}