import axios from 'axios';
import { USER_URL } from '../constants/Configuration';

const editUser = async (data, phone, token)  => {
    const config = { headers: { Authorization: `bearer ${token}` } };
    const response = await axios.put(`${USER_URL}/${phone}`, data, config)
        .catch(err => { throw err.response });
    return response.data;
}

export default {editUser};