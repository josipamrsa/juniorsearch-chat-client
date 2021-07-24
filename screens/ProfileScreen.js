import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = (props) => {
    const [loggedUser, setLoggedUser] = useState("");
    const [userData, setUserData] = useState("");

    const readData = async (key) => {
        try {
            const data = await AsyncStorage.getItem(`@${key}`);
            setUserData(JSON.parse(data));
            //console.log(data);
        } catch (err) { console.log(err.response); }
    }

    useEffect(() => {
        readData("JuniorChat_userDetail"); // TODO - spremiti pod Constants ove stringove
    }, []);

    return (
        <View style={profStyle.screen}>
            <Text>Ime i prezime: {userData.firstName} {userData.lastName}</Text>
            <Text>Lokacija {userData.currentResidence}</Text>
            <Text>Broj telefona: {userData.phoneNumber}</Text>
            <Text>Email adresa: {userData.email}</Text>
        </View>
    )
};

const profStyle = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start"
    }
});

export default ProfileScreen;