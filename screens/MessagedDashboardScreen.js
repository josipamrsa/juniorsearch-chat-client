import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Alert, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationEvents } from 'react-navigation';

import UserDetails from '../components/UserDetails';

import useWebSockets from '../hooks/useWebSockets';
import useExpoPushNotifications from '../hooks/useExpoPushNotifications';

import authService from '../services/authService';
import messagingService from '../services/messagingService';

const MessagedDashboardScreen = (props) => {
    const [update, setUpdate] = useState(false);
    const [loggedUser, setLoggedUser] = useState("");
    const [messagedList, setMessagedList] = useState([]);

    const {
        notification,
        connectToUser,
        conversationDeleted,
        setNotification
    } = useWebSockets();

    const {
        sendPushNotification,
        expoPushToken
    } = useExpoPushNotifications();

    const readUserData = async (key) => {
        try {
            const logged = await AsyncStorage.getItem(`@${key}`);
            let parseLogged = JSON.parse(logged);
            setLoggedUser(parseLogged);

            authService.setToken(parseLogged.token);
            authService.fetchUserData(parseLogged.phone)
                .then((response) => {
                    setMessagedList(response.chatted);

                }).catch((err) => {
                    console.log(err.response);
                });
        } catch (err) { console.log(err.response); }
    }

    const deleteConversation = (users, token, connection) => {
        Alert.alert(
            "Delete conversation",
            "Are you sure you want to delete this conversation? Conversation will be deleted for both participants!",
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                },
                {
                    text: 'OK',
                    onPress: () => deletePress(users, token, connection)
                }],
            { cancelable: false }
        );

        const deletePress = (u, t) => {
            messagingService.getCurrentConversation(u, t).then((response) => {
                const c = response.id;
                messagingService.deleteConversation(u, t, c)
                    .then((response) => {
                        setMessagedList(messagedList.filter(m => !u.includes(m.phoneNumber)));
                        conversationDeleted(connection);
                    }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }
    }

    useEffect(() => {
        console.log(notification);
        readUserData("JuniorChat_user");
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
            delete={() => {
                let users = [loggedUser.phone, user.item.phoneNumber];
                deleteConversation(users, loggedUser.token, user.item.activeConnection);
            }}
            startChat={() => {
                props.navigation.navigate({
                    routeName: "ChatWindow",
                    params: {
                        currentConversation: "",
                        loggedPhone: loggedUser.phone,
                        phoneNumber: user.item.phoneNumber,
                        activeConnection: user.item.activeConnection,
                        userFullName: `${user.item.firstName} ${user.item.lastName}`,
                        sendNewMessage: (participant, message) => connectToUser(participant, message)
                    }
                })
            }}
        />);
    }

    return (
        <View>
            <NavigationEvents onWillFocus={
                /* FALA BOGU ISUSU KRISTU I DUHU SVETOM I SVIM APOSTOLIMA I SVIM SVECIMA SKUPA OVO KONACNO RADI */
                (payload) => { setUpdate(true); }} />
            <FlatList
                data={messagedList}
                renderItem={showUsers} />
        </View>
    );
};

const messagedStyle = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center"
    }
});

export default MessagedDashboardScreen;