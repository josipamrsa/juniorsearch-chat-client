import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import OnlineStatus from './OnlineStatus';
import CircleProfilePicture from './CircleProfilePicture';


const ShowUserProfile = (props) => {
    const [userData, setUserData] = useState("");
    // Unknown User
    const [firstName, setFirstName] = useState("U");
    const [lastName, setLastName] = useState("U");


    const readData = async (key) => {
        try {
            const data = await AsyncStorage.getItem(`@${key}`);
            return JSON.parse(data);
        } catch (err) { console.log(err.response); }
    }

    useEffect(() => {
        readData("JuniorChat_userDetail").then((response) => {
            setUserData(response);
            setFirstName(response.firstName[0]);
            setLastName(response.lastName[0]);
        })
    }, []);

    return (
        <View>
            <View style={showProfileStyle.nameHeader}>
                <CircleProfilePicture
                    firstName={firstName}
                    lastName={lastName}
                    circleSize={{ padding: 0 }}
                    imageSize={{ width: 80, height: 80 }}
                    textSize={{ fontSize: 40 }} />

                <Text style={showProfileStyle.userNameArea}>
                    <Text style={showProfileStyle.userName}>{userData.firstName} {userData.lastName} </Text>
                    <OnlineStatus
                        color={userData.activeConnection !== "" ?
                            { backgroundColor: "limegreen" } :
                            { backgroundColor: "lightgray" }
                        } />
                </Text>
            </View>

            <View style={showProfileStyle.locationHeader}>
                <Text style={showProfileStyle.locationHeaderText}>
                    {userData.currentResidence}
                </Text>
            </View>

            <View style={showProfileStyle.contactHeader}>
                {/* TODO - razdvojiti naslove i podatke, da su onako
                broj        091
                email       mail  */}
                <View>
                    <Text>Phone number: {userData.phoneNumber}</Text>
                    <Text>Email: {userData.email}</Text>
                </View>

            </View>
        </View>
    )
};

const showProfileStyle = StyleSheet.create({
    nameHeader: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: "lightgray"
    },

    userNameArea: {
        alignItems: 'center'
    },

    userName: {
        fontSize: 25
    },

    locationHeader: {
        alignItems: 'center',
    },

    locationHeaderText: {
        fontSize: 20,
        fontStyle: "italic",
        color: "gray"
    },

    contactHeader: {
        alignItems: 'center',
    }
});

export default ShowUserProfile;