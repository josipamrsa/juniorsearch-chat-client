import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, View, Text } from 'react-native';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';

import AsyncStorage from '@react-native-async-storage/async-storage';
import useWebSockets from '../hooks/useWebSockets';
import messagingService from '../services/messagingService';

const ChatScreen = (props) => {
    const [loggedUser, setLoggedUser] = useState("");
    const [currentConversation, setCurrentConversation] = useState([]);


    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [update, setUpdate] = useState(false);

    const { notification } = useWebSockets();

    let conversationExists = props.navigation.getParam('conversationExists');
    const userOnline = props.navigation.getParam('activeConnection'); // TODO - ako se korisnik ulogira?
    const sendNewMessage = props.navigation.getParam("sendNewMessage");

    const users = [
        props.navigation.getParam('loggedPhone'),
        props.navigation.getParam('phoneNumber')
    ];

    const readData = async (key) => {
        try {
            const logged = await AsyncStorage.getItem(`@${key}`);
            let parseLogged = JSON.parse(logged);
            setLoggedUser(parseLogged);
            setAuthor(parseLogged.phone);
        } catch (err) { console.log(err.response); }
    }

    useEffect(() => {
        readData("JuniorChat_user");

        if (conversationExists) {
            messagingService.getCurrentConversation(users, loggedUser.token)
                .then((response) => {
                    let inverse = response;
                    inverse.messages = inverse.messages.reverse();
                    setCurrentConversation(inverse);
                    setUpdate(false);
                }).catch((err) => { console.log(err) });
        }

    }, [notification, update]);

    const showMessages = (messages) => {
        return (
            <MessageBubble
                content={messages.item.content}
                author={messages.item.author}
                participants={currentConversation.users}
                logged={loggedUser} />
        );
    };

    const startConversation = (data, token, users, userOnline) => {
        messagingService.startNewConversation(users, loggedUser.token)
            .then((response) => {
                conversationExists = true;
                setCurrentConversation(response);
                newMessage(data, token, response.id, userOnline);
            })
    }

    const newMessage = (data, token, convo, userOnline) => {
        messagingService.saveMessage(data, token, convo)
            .then((response) => {
                setContent("");
                Keyboard.dismiss();
                if (userOnline) sendNewMessage(userOnline, data);
                setUpdate(true);
            });
    }

    const sendMessage = () => {
        const data = {
            content,
            author,
            dateSent: new Date()
        }

        !conversationExists ?
            startConversation(data, loggedUser.token, users, userOnline) :
            newMessage(data, loggedUser.token, currentConversation.id, userOnline);
    }

    return (
        <View style={chatStyle.screen}>
            <FlatList
                inverted
                data={currentConversation.messages}
                renderItem={showMessages} />
            <MessageInput
                content={content}
                setContent={setContent}
                sendMessage={sendMessage} />
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

