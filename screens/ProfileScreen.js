import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { NavigationActions, NavigationEvents } from 'react-navigation';

import ShowUserProfile from '../components/ShowUserProfile';
import NavButton from '../components/NavButton';
import EditUserProfile from '../components/EditUserProfile';

const ProfileScreen = (props) => {
    const [loggedUser, setLoggedUser] = useState("");
    const editMode = props.navigation.getParam("editMode");
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        setUpdate(false);
    }, [update])

    return (
        <View style={profStyle.screen}>
            <NavigationEvents onWillFocus={
                /* FALA BOGU ISUSU KRISTU I DUHU SVETOM I SVIM APOSTOLIMA I SVIM SVECIMA SKUPA OVO KONACNO RADI */
                (payload) => { setUpdate(true); }} />

            {
                editMode ?
                    <EditUserProfile
                        update={update}
                        setUpdate={setUpdate}
                        setLoggedUser={setLoggedUser} /> :
                    <ShowUserProfile
                        update={update}
                        setUpdate={setUpdate} />
            }
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
                            navigationData.navigation.setParams({ editMode: !edit });
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
