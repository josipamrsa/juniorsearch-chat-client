
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputComponent from './InputComponent';
import CustomizableButton from './CustomizableButton';
import userService from '../services/userService';

const EditUserProfile = (props) => {
    const [loggedUser, setLoggedUser] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [location, setLocation] = useState("");
    const [email, setEmail] = useState("");

    const checkFirstName = (data) => setFirstName(data);
    const checkLastName = (data) => setLastName(data);
    const checkLocation = (data) => setLocation(data);
    const checkEmail = (data) => setEmail(data);

    const updateUserData = async (key, value) => {
        try {
            await AsyncStorage.setItem(`@${key}`, JSON.stringify(value));
        } catch (err) { }
    }

    const readData = async (key) => {
        try {
            const data = await AsyncStorage.getItem(`@${key}`);
            return JSON.parse(data);
        } catch (err) { console.log(err.response); }
    }

    const updateUser = () => {
        const updateDetails = {
            email,
            location,
            firstName,
            lastName
        }

        userService.editUser(updateDetails, loggedUser.phone, loggedUser.token).then((response) => {
            updateUserData("JuniorChat_userDetail", response);
            props.setUpdate(true);
        });

        Alert.alert(
            "Data updated",
            "User data has been updated!",
            [
                {
                    text: 'OK',
                    onPress: () => console.log("updated")
                }
            ]
        );
    }

    useEffect(() => {
        readData("JuniorChat_userDetail").then((response) => {
            setFirstName(response.firstName);
            setLastName(response.lastName);
            setLocation(response.currentResidence);
            setEmail(response.email);
        });

        readData("JuniorChat_user").then((response) => {
            setLoggedUser(response);
        });
    }, [props.update]);

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

                <CustomizableButton
                    button={editProfileStyle.button}
                    description={"Save changes"}
                    action={() => { updateUser(); }} />
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