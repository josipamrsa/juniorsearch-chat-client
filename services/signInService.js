//----KONFIGURACIJA----//
import axios from 'axios';

import { 
    SIGN_IN_URL, 
    USER_URL 
} from '../constants/Configuration';

//----METODE----//

// Prijava korisnika
const signIn = async data => {
    const response = await axios.post(SIGN_IN_URL, data)
        .catch(err => { throw err.response });

    return response.data;
}

// Registracija korisnika
const signUp = async data => {
    const response = await axios.post(USER_URL, data)
        .catch(err => { throw err.response });
    return response.data;
}

export default { 
    signIn, 
    signUp 
}