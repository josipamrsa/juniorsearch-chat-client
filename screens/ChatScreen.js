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
    const [convoLength, setConvoLength] = useState(0);

    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [update, setUpdate] = useState(false);

    const { notification } = useWebSockets();

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

        messagingService.getCurrentConversation(users, loggedUser.token)
            .then((response) => {
                let inverse = response;
                inverse.messages = inverse.messages.reverse();

                setCurrentConversation(inverse);
                //console.log("abc");
                //console.log(response.messages.length);
                //console.log(response.messages.reverse());
                setUpdate(false);
            });
        
        
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
                Keyboard.dismiss();
                // TODO - vratiti jednu poruku (messages.GET prema id iz response) možda?
                // TODO - ZALIPAČIT ČET PORUKU OD DRUGOG U OVO 
                if (userOnline) sendNewMessage(userOnline, data);
                setUpdate(true);
            });
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

