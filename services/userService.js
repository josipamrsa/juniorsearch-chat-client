//----KONFIGURACIJA----//
import axios from 'axios';
import { USER_URL } from '../constants/Configuration';

//----METODE----//

// Uređivanje korisničkih podataka
const editUser = async (data, phone, token) => {
    const config = { headers: { Authorization: `bearer ${token}` } };
    const response = await axios.put(`${USER_URL}/${phone}`, data, config)
        .catch(err => { throw err.response });
    return response.data;
}

export default { editUser }