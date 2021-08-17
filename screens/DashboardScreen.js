import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Alert, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationEvents } from 'react-navigation';

import useWebSockets from '../hooks/useWebSockets';
import useExpoPushNotifications from '../hooks/useExpoPushNotifications';

import authService from '../services/authService';
import messagingService from '../services/messagingService';

import UserDetails from '../components/UserDetails';
import StartConversationModal from '../components/StartConversationModal';


const DashboardScreen = (props) => {
    const [loggedUser, setLoggedUser] = useState(props.navigation.getParam("user"));
    const [fullName, setFullName] = useState("");

    const [update, setUpdate] = useState(false);
    const [userList, setUserList] = useState([]);
    const [startConvo, setStartConvo] = useState(false);
    const [selected, setSelected] = useState("");

    const {
        sendPushNotification,
        expoPushToken
    } = useExpoPushNotifications();

    const {
        userVerified,
        connectToUser,
        conversationStarted,
        notification,
        setNotification
    } = useWebSockets();

    const storeUserData = async (key, value) => {
        try {
            await AsyncStorage.setItem(`@${key}`, JSON.stringify(value));
            let keys = await AsyncStorage.getAllKeys();
            console.log(keys);
        } catch (err) { }
    }

    const loadUserData = () => {
        //console.log(props.navigation);
        setLoggedUser(props.navigation.getParam("user"));

        authService.setToken(loggedUser.token);
        authService.fetchUserData(loggedUser.phone)
            .then((response) => {
                setUserList(response.notChatted);
                setFullName(response.fullName);
                storeUserData("JuniorChat_user", loggedUser); // TODO - spremiti pod Constants ove stringove
                //console.log(response);
                // ovo bi moglo izazvati probleme kod osvježavanja veze (reload ili nepredvidljivi element možda...)
                if (!response.activeConnection) {
                    let socket = userVerified();
    
                    authService.setOnlineStatus(loggedUser.phone, { socket, onlineTag: true })
                        .then((response) => {
                            //console.log(response);
                            storeUserData("JuniorChat_userDetail", response);
                        }).catch(err => console.log(err));
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        loadUserData();
        setUpdate(false);

        if (!notification.noPush)
            sendPushNotification(expoPushToken, notification);

        setNotification('');
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
                (payload) => { setUpdate(true); }} />

            <StartConversationModal
                visible={startConvo}
                setVisible={setStartConvo}
                selected={selected}
                logged={loggedUser}
                userList={userList}
                fullName={fullName}
                startNewConvo={messagingService.startNewConversation}
                setUserList={setUserList}
                setUpdate={setUpdate}
                startedConversation={conversationStarted}
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
