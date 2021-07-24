import axios from 'axios';
import { USER_URL, CONVERSATION_URL } from '../constants/Configuration';

let token = null;

const setToken = newToken => {
    token = `bearer ${newToken}`;
}

const fetchUserData = async phone => {
    const config = { headers: { Authorization: token } };
    const response = await axios.get(`${CONVERSATION_URL}/${phone}`, config);
    return response.data;
}

const setOnlineStatus = async (phone, data) => {
    const config = { headers: { Authorization: token } };
    const response = await axios.put(`${USER_URL}/online/${phone}`, data, config)
        .catch(err => { throw err.response });
    return response.data;
}

export default { setToken, fetchUserData, setOnlineStatus }