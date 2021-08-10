import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import OnlineStatus from './OnlineStatus';
import CircleProfilePicture from './CircleProfilePicture';
import UserDetailGridCard from './UserDetailGridCard';


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

            <View style={showProfileStyle.detailHeader}>

                <View style={showProfileStyle.detailArea}>
                    <Text style={showProfileStyle.detailTitle}>
                        User details
                    </Text>
                </View>

                <UserDetailGridCard
                    field={"Location:"}
                    data={userData.currentResidence} />

                <UserDetailGridCard
                    field={"Email:"}
                    data={userData.email} />

                <UserDetailGridCard
                    field={"Phone:"}
                    data={userData.phoneNumber} />
            </View>
        </View>
    )
};

const showProfileStyle = StyleSheet.create({
    nameHeader: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: "lightgray",
        elevation: 5
    },
    userNameArea: {
        alignItems: 'center'
    },
    userName: {
        fontSize: 25
    },
    locationHeaderText: {
        fontSize: 20,
        fontStyle: "italic",
        color: "gray"
    },
    detailHeader: {
        alignItems: 'center',
        padding: 10,
        marginTop: 10
    },
    detailTitle: {
        fontWeight: "bold",
        fontSize: 25,
        marginBottom: 15
    },
    detailArea: {
        flexDirection: 'row',
        width: "90%",
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2
    }
});

export default ShowUserProfile;


/*<View style={showProfileStyle.detailArea}>
                    <Text style={showProfileStyle.detailTextHeader}>
                        Location:
                    </Text>

                    <Text style={showProfileStyle.detailText}>
                        {userData.currentResidence}
                    </Text>
                </View>

                <View style={showProfileStyle.detailArea}>
                    <Text style={showProfileStyle.detailTextHeader}>
                        Email:
                    </Text>

                    <Text style={showProfileStyle.detailText}>
                        {userData.email}
                    </Text>
                </View>

                <View style={showProfileStyle.detailArea}>
                    <Text style={showProfileStyle.detailTextHeader}>
                        Phone number:
                    </Text>

                    <Text style={showProfileStyle.detailText}>
                        {userData.phoneNumber}
                    </Text>
                </View>
 */