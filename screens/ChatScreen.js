import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWebSockets } from '../hooks/useWebSockets';
import messagingService from '../services/messagingService';

const ChatScreen = (props) => {
    const [loggedUser, setLoggedUser] = useState("");
    const [currentConversation, setCurrentConversation] = useState([]);
    //const connect = props.navigation.getParam("connect");
    //connect();

    const users = [
        props.navigation.getParam('loggedPhone'),
        props.navigation.getParam('phoneNumber')
    ];

    const readData = async (key) => {
        try {
            const logged = await AsyncStorage.getItem(`@${key}`);
            let parseLogged = JSON.parse(logged);
            setLoggedUser(parseLogged);
        } catch (err) { console.log(err.response); }
    }

    useEffect(() => {
        readData("JuniorChat_user");
        
        messagingService.getCurrentConversation(users, loggedUser.token)
            .then((response) => {
                //console.log(response);
                setCurrentConversation(response);
                //console.log(response);
            });
    }, []);

    const showMessages = (messages) => {
        //console.log(currentConversation.users);
        //console.log(messages.item.author);
        return (
            <MessageBubble
                content={messages.item.content}
                author={messages.item.author}
                participants={currentConversation.users}
                logged={loggedUser} />
        );
    };

    return (
        <View style={chatStyle.screen}>
            <FlatList
                data={currentConversation.messages}
                renderItem={showMessages} />
            <MessageInput />
        </View>
    )
};

ChatScreen.navigationOptions = (navigationData) => {
    const userFullName = navigationData.navigation.getParam("userFullName");
    return {
        headerTitle: userFullName
    }
}

const chatStyle = StyleSheet.create({
    screen: {
        flex: 1,
        width: "100%"
    }
});

export default ChatScreen;

