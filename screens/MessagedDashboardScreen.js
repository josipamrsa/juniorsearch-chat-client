import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NavigationActions } from 'react-navigation'; // za ugniježđenu navigaciju

import UserDetails from '../components/UserDetails';
import useWebSockets from '../hooks/useWebSockets';
import authService from '../services/authService';
import messagingService from '../services/messagingService';

const MessagedDashboardScreen = (props) => {
    const [loggedUser, setLoggedUser] = useState("");
    const [messagedList, setMessagedList] = useState([]);

    const {
        notification,
        connectToUser,
    } = useWebSockets();

    const readData = async (key) => {
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

    const deleteConversation = (users, token) => {
        console.log(users);
        Alert.alert("Delete conversation", "Are you sure you want to delete this conversation? Conversation will be deleted for both participants!", [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
            },
            {
                text: 'OK',
                onPress: () => deletePress(users, token)
            }],
            { cancelable: false }
        );

        const deletePress = (u, t) => {
            messagingService.getCurrentConversation(u, t).then((response) => {
                const c = response.id;
                messagingService.deleteConversation(u, t, c)
                    .then((response) => {
                        console.log("Conversation deleted...");
                        setMessagedList(messagedList.filter(m => !u.includes(m.phoneNumber)))
                        props.navigation.navigate("Dashboard",
                            {},
                            NavigationActions.navigate({
                                routeName: 'PrivateMessaging',
                                params: {
                                    user: loggedUser
                                }
                            })
                        );
                    }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }
    }

    useEffect(() => {
        readData("JuniorChat_user");
    }, [notification]);

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
                deleteConversation(users, loggedUser.token);
            }}
            startChat={() => {
                props.navigation.navigate({
                    routeName: "ChatWindow",
                    params: {
                        conversationExists: true,
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
        <FlatList
            data={messagedList}
            renderItem={showUsers} />
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