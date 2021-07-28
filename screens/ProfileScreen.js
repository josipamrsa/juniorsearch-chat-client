import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ShowUserProfile from '../components/ShowUserProfile';
import NavButton from '../components/NavButton';

const ProfileScreen = (props) => {
    const [loggedUser, setLoggedUser] = useState("");
    const [userData, setUserData] = useState("");
    const editMode = props.navigation.getParam("editMode");

    const readData = async (key) => {
        try {
            const data = await AsyncStorage.getItem(`@${key}`);
            console.log(data);
            setUserData(JSON.parse(data));
            //console.log(data);
        } catch (err) { console.log(err.response); }
    }

    useEffect(() => {
        readData("JuniorChat_userDetail"); // TODO - spremiti pod Constants ove stringove
    }, []);

    return (
        <View style={profStyle.screen}>
            {/* <Text>Ime i prezime: {userData.firstName} {userData.lastName}</Text>
            <Text>Lokacija {userData.currentResidence}</Text>
            <Text>Broj telefona: {userData.phoneNumber}</Text>
            <Text>Email adresa: {userData.email}</Text> */}


            {editMode ?
                <View>
                    <Text>Edit mode!</Text>
                </View> :

                <View>
                    <ShowUserProfile
                        firstName={userData.firstName}
                        lastName={userData.lastName}
                        phone={userData.phoneNumber}
                        activeConnection={userData.activeConnection}
                        email={userData.email}
                        location={userData.currentResidence} />
                </View>}

        </View>
    )
};

ProfileScreen.navigationOptions = (navigationData) => (
    {
        headerTitle: "User profile",
        headerRight: () => {
            //console.log(navigationData.navigation);
            return (
                <HeaderButtons HeaderButtonComponent={NavButton}>
                    <Item
                        title="Edit profile"
                        iconName='pencil'
                        onPress={() => {
                            let edit = navigationData.navigation.getParam("editMode");
                            navigationData.navigation.setParams({editMode: !edit});
                            //console.log(navigationData.navigation.getParam("editMode"));
                        }} />
                </HeaderButtons>
            )
        }
    })

const profStyle = StyleSheet.create({
    screen: {
        flex: 1,
        width: "100%"
    }
});

export default ProfileScreen;