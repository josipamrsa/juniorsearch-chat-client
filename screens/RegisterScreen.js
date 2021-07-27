//----KONFIGURACIJA----//
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Alert
} from 'react-native';

import signInService from '../services/signInService';
import CustomizableButton from '../components/CustomizableButton';
import GridCard from '../components/GridCard';
import InputComponent from '../components/InputComponent';

const RegisterScreen = (props) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [email, setEmail] = useState("");
    const [pass, setPassword] = useState("");

    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("");

    const checkFirstName = (data) => setFirstName(data);
    const checkLastName = (data) => setLastName(data);

    const checkEmail = (data) => setEmail(data);
    const checkPassword = (data) => setPassword(data);

    const checkPhoneNumber = (data) => setPhoneNumber(data);
    const checkLocation = (data) => setLocation(data);

    const registerUser = async () => {
        try {
            const signedUp = await signInService.signUp({
                phoneNumber,
                email,
                pass,
                firstName,
                lastName,
                location
            });
            //console.log(signedUp);

            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setPhoneNumber('');
            setLocation('');

            props.navigation.replace("SignIn");

        } catch (err) {
            Alert.alert(`There was an error while signing up - ${err}`);
            console.log(err);
        }
    }

    return (
        <View style={registerStyle.container}>

            <GridCard>
                <View style={registerStyle.section}>
                    <InputComponent 
                        placeholder="First name..."
                        value={firstName}
                        onChangeText={checkFirstName} />

                    <InputComponent
                        placeholder="Last name..."
                        value={lastName}
                        onChangeText={checkLastName} />
                </View>

                <View style={registerStyle.section}>
                    <InputComponent 
                        placeholder="Email address..."
                        value={email}
                        onChangeText={checkEmail} />

                    <InputComponent 
                        placeholder="Password..."
                        value={pass}
                        onChangeText={checkPassword}  />
                </View>

                <View style={registerStyle.section}>
                    <InputComponent 
                        placeholder="Phone number..."
                        value={phoneNumber}
                        onChangeText={checkPhoneNumber} />

                    <InputComponent 
                        placeholder="Lives in..."
                        value={location}
                        onChangeText={checkLocation} />
                </View>

                <CustomizableButton
                    button={registerStyle.button}
                    description={"Register"}
                    action={registerUser} />
            </GridCard>
        </View>
    );
}

const registerStyle = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    section: {
        marginBottom: 15
    },
    button: {
        backgroundColor: "tomato",
    },
});

export default RegisterScreen;