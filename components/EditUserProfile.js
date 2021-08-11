
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputComponent from './InputComponent';
import CustomizableButton from './CustomizableButton';

const EditUserProfile = (props) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [location, setLocation] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const checkFirstName = (data) => setFirstName(data);
    const checkLastName = (data) => setLastName(data);
    const checkLocation = (data) => setLocation(data);
    const checkEmail = (data) => setEmail(data);
    const checkPhone = (data) => setPhone(data);

    const readData = async (key) => {
        try {
            const data = await AsyncStorage.getItem(`@${key}`);
            return JSON.parse(data);
        } catch (err) { console.log(err.response); }
    }

    useEffect(() => {
        readData("JuniorChat_userDetail").then((response) => {
            setFirstName(response.firstName);
            setLastName(response.lastName);
            setLocation(response.currentResidence);
            setEmail(response.email);
            setPhone(response.phoneNumber);
        });
    }, []);

    return (
        <View style={editProfileStyle.area}>
            <View style={editProfileStyle.editContainer}>
                <Text
                    style={editProfileStyle.editHeaderText}>
                    Edit profile
                </Text>

                <InputComponent
                    placeholder="First name..."
                    value={firstName}
                    onChangeText={checkFirstName} />

                <InputComponent
                    placeholder="Last name..."
                    value={lastName}
                    onChangeText={checkLastName} />

                <InputComponent
                    placeholder="Location..."
                    value={location}
                    onChangeText={checkLocation} />

                <InputComponent
                    placeholder="Email..."
                    value={email}
                    onChangeText={checkEmail} />

                <InputComponent
                    placeholder="Phone..."
                    value={phone}
                    onChangeText={checkPhone} />

                <CustomizableButton
                    button={editProfileStyle.button}
                    description={"Save changes"}
                    action={() => { }} />
            </View>
        </View>
    )
};

const editProfileStyle = StyleSheet.create({
    area: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10%"
    },
    editContainer: {
        width: "85%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 10
    },
    editHeaderText: {
        fontSize: 25,
        marginBottom: 10,
        fontWeight: "bold",
        color: "tomato"
    },
    button: {
        backgroundColor: "tomato",
    }
});

export default EditUserProfile;