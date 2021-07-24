//----KONFIGURACIJA----//
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';

import CustomizableButton from '../components/CustomizableButton';
import GridCard from '../components/GridCard';
import InputComponent from '../components/InputComponent';

const LoginScreen = () => {
    return (
        <View style={registerStyle.container}>

            <GridCard>
                <View style={registerStyle.section}>
                    <InputComponent placeholder="First name..." />
                    <InputComponent placeholder="Last name..." />
                </View>

                <View style={registerStyle.section}>
                    <InputComponent placeholder="Email address..." />
                    <InputComponent placeholder="Password..." />
                </View>

                <View style={registerStyle.section}>
                    <InputComponent placeholder="Phone number..." />
                    <InputComponent placeholder="Lives in..." />
                </View>

                <CustomizableButton
                    button={registerStyle.button}
                    description={"Register"}
                    action={() => { }} />
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

export default LoginScreen;