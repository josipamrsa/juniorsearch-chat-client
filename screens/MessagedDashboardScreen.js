import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UserDetails from '../components/UserDetails';
import useWebSockets from '../hooks/useWebSockets';
import authService from '../services/authService';

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
            startChat={() => {
                props.navigation.navigate({
                    routeName: "ChatWindow",
                    params: {
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