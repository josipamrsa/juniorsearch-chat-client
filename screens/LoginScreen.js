//----KONFIGURACIJA----//
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';

import { NavigationActions } from 'react-navigation'; // za ugniježđenu navigaciju

import signInService from '../services/signInService';
import CustomizableButton from '../components/CustomizableButton';
import GridCard from '../components/GridCard';
import InputComponent from '../components/InputComponent';

const LoginScreen = (props) => {
    //console.log(signInService);
    const [email, setEmail] = useState("jopa@jopa.hr");
    const [pass, setPassword] = useState("jopica4");

    const checkEmail = (data) => setEmail(data); 
    const checkPassword = (data) => setPassword(data);

    const signInUser = async () => {
        try {
            const signedIn = await signInService.signIn({ email, pass });
            
            setEmail('');
            setPassword('');

            props.navigation.replace("Dashboard",
                { },
                NavigationActions.navigate(
                    {
                        routeName: 'PrivateMessaging',
                        params: {
                            user: signedIn
                        }
                    }
                ));

        } catch (err) {
            Alert.alert(`There was an error while signing in - ${err}`);
            console.log(err);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={loginStyle.container}>
                <GridCard>
                    <InputComponent
                        placeholder="Email address..."
                        value={email}
                        onChangeText={checkEmail} />

                    <InputComponent
                        placeholder="Password..."
                        value={pass}
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

const loginStyle = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: "tomato",
    }
});

export default LoginScreen;