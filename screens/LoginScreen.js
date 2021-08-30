//----KONFIGURACIJA----//
import React, {
    useState,
} from 'react';

import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,   // "Tapkanje" po ekranu
    Keyboard,                   // Rad s tipkovnicom
    Alert
} from 'react-native';

// Ugnježđena navigacija - slanje parametara bez potrebe za korištenjem Reduxa
import { NavigationActions } from 'react-navigation'; 

//----SERVISI----//
import signInService from '../services/signInService';

//----KOMPONENTE----//
import CustomizableButton from '../components/CustomizableButton';      // Komponenta za zamjenu klasičnog botuna u React Native
import GridCard from '../components/GridCard';                          // Prikaz kartice za registraciju (stilizacija)
import InputComponent from '../components/InputComponent';              // Komponenta za unos

//----TEME----//
import CurrentTheme from '../constants/CurrentTheme';

//----EKRAN----//
const LoginScreen = (props) => {
    const [email, setEmail] = useState("dave@mail.hr"); 
    const [pass, setPassword] = useState("sifra1234"); 

    //----STANJA----//

    // Podaci potrebni za prijavu...
    /* const [email, setEmail] = useState("");                  
    const [pass, setPassword] = useState("");         */       
    
    const checkEmail = (data) => setEmail(data);
    const checkPassword = (data) => setPassword(data);

    //----METODE----//

    // Prijava korisnika u aplikaciju
    const signInUser = async () => {
        /*  
            1. Pošalji zahtjev prema serveru
            2. Postavi stanja na prazno
            3. Prijeđi na novi ekran i pošalji 
               parametar prijavljenog korisnika 
               kroz navigaciju
            4. Ako ne uspije, prikaži grešku
        */

        try {
            const signedIn = await signInService.signIn({ email, pass });

            setEmail('');
            setPassword('');

            props.navigation.replace("Dashboard", {},
                NavigationActions.navigate(
                    {
                        routeName: 'PrivateMessaging',
                        params: { user: signedIn }
                    }
                ));

        } catch (err) {
            Alert.alert(`There was an error while signing in - ${err}`);
            console.log(err);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => 
            /* Kada korisnik dotakne van tipkovnice */
            Keyboard.dismiss() }>

            <View style={loginStyle.container}>
                <GridCard>
                    <InputComponent
                        placeholder="Email address..."
                        value={email}
                        inputStyle={loginStyle.input}
                        onChangeText={checkEmail} />

                    <InputComponent
                        placeholder="Password..."
                        value={pass}
                        inputStyle={loginStyle.input}
                        onChangeText={checkPassword} />

                    <CustomizableButton
                        button={loginStyle.button}
                        description={"Sign in"}
                        action={signInUser} />
                </GridCard>
            </View>

        </TouchableWithoutFeedback>
    );
}

//----STILOVI----//
const loginStyle = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: CurrentTheme.MAIN_SCREEN_COLOR
    },
    button: {
        backgroundColor: CurrentTheme.BUTTON_COLOR,
    },
    input: {
        backgroundColor: CurrentTheme.INPUT_COLOR,
        color: CurrentTheme.INPUT_TEXT_COLOR
    }
});

export default LoginScreen;