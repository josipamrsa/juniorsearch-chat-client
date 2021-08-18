import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, View, Text } from 'react-native';
import { NavigationEvents } from 'react-navigation';

import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';

import AsyncStorage from '@react-native-async-storage/async-storage';
import useWebSockets from '../hooks/useWebSockets';

import messagingService from '../services/messagingService';

const ChatScreen = (props) => {
    const [loggedUser, setLoggedUser] = useState("");
    const [currentConversation, setCurrentConversation] = useState([]);
    //console.log(props.navigation);

    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [update, setUpdate] = useState(false);

    const {
        notification,
        setNotification
    } = useWebSockets();

    const userOnline = props.navigation.getParam('activeConnection');
    const sendNewMessage = props.navigation.getParam("sendNewMessage");
    const senderFullName = props.navigation.getParam("senderFullName");

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
        console.log(notification);
        //console.log(props.navigation);

        readData("JuniorChat_user");

        messagingService.getCurrentConversation(users, loggedUser.token)
            .then((response) => {
                let inverse = response;
                inverse.messages = inverse.messages.reverse();
                setCurrentConversation(inverse);
                setUpdate(false);
            })
            .catch((err) => { console.log(err) });
        setNotification('');
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

    const sendMessage = () => {
        const data = {
            content,
            author,
            dateSent: new Date()
        }

        messagingService.saveMessage(data, loggedUser.token, currentConversation.id)
            .then((response) => {
                setContent("");
                setUpdate(true);
                Keyboard.dismiss();
                if (userOnline) {
                    sendNewMessage(userOnline, data, senderFullName);
                }
            }).catch(err => console.log(err));
    }

    return (
        <View style={chatStyle.screen}>
            <NavigationEvents onWillFocus={
                /* FALA BOGU ISUSU KRISTU I DUHU SVETOM I SVIM APOSTOLIMA I SVIM SVECIMA SKUPA OVO KONACNO RADI */
                (payload) => { setUpdate(true); }} />

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
