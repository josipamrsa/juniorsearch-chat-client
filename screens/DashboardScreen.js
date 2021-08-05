import React, { useState, useEffect} from 'react';
import { StyleSheet, FlatList, Alert, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationEvents } from 'react-navigation';

import useWebSockets from '../hooks/useWebSockets';

import authService from '../services/authService';
import messagingService from '../services/messagingService';

import UserDetails from '../components/UserDetails';
import StartConversationModal from '../components/StartConversationModal';

const DashboardScreen = (props) => {
    const loggedUser = props.navigation.getParam("user");
    
    const [update, setUpdate] = useState(false);
    const [userList, setUserList] = useState([]);
    const [startConvo, setStartConvo] = useState(false);
    const [selected, setSelected] = useState("");

    const {
        userVerified,
        connectToUser,
        notification
    } = useWebSockets();

    const storeUserData = async (key, value) => {
        try {
            await AsyncStorage.setItem(`@${key}`, JSON.stringify(value));
        } catch (err) { }
    }

    const loadUserData = () => {
        // TODO - update za brisanje razgovora i update na ovoj listi i obrnuto
        authService.setToken(loggedUser.token);
        authService.fetchUserData(loggedUser.phone)
            .then((response) => {
                setUserList(response.notChatted);
                storeUserData("JuniorChat_user", loggedUser); // TODO - spremiti pod Constants ove stringove

                const socket = userVerified();
                authService.setOnlineStatus(loggedUser.phone, { socket, onlineTag: true })
                    .then((response) => {
                        storeUserData("JuniorChat_userDetail", response);
                    });
            })
            .catch((err) => {
                console.log(err.response)
            });
    }

    useEffect(() => {
        loadUserData();
        setUpdate(false);
    }, [notification, update]);

    const showUsers = (user) => {
        return (<UserDetails
            firstName={user.item.firstName}
            lastName={user.item.lastName}
            email={user.item.email}
            residence={user.item.currentResidence}
            phoneNumber={user.item.phoneNumber}
            onlineStatus={user.item.activeConnection}
            startChat={() => {
                setSelected(user.item);
                setStartConvo(true);
            }}
        />);
    }

    return (
        <View>
            <NavigationEvents onWillFocus={
                /* FALA BOGU ISUSU KRISTU I DUHU SVETOM I SVIM APOSTOLIMA I SVIM SVECIMA SKUPA OVO KONACNO RADI */
                (payload) => { setUpdate(true); } } /> 

            <StartConversationModal
                visible={startConvo}
                setVisible={setStartConvo}
                selected={selected}
                logged={loggedUser}
                userList={userList}
                startNewConvo={messagingService.startNewConversation}
                setUserList={setUserList}
                setUpdate={setUpdate}
                connect={connectToUser} />

            <FlatList
                data={userList}
                renderItem={showUsers} />
        </View>

    );
};

const dashStyle = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%"
    }
});

export default DashboardScreen;
