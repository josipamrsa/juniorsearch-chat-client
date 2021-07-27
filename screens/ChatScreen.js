import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import { CONVERSATIONS } from '../test-data/dummyData';
import { useWebSockets } from '../hooks/useWebSockets';

const ChatScreen = (props) => {
    const currentConversation = CONVERSATIONS.find(c => c.id === "r1");
    const logged = currentConversation.users.find(u => u.id === "1").id;
    const connect = props.navigation.getParam("connect");
    connect();

    //console.log(props.navigation);

    const showMessages = (messages) => {
        return (
            <MessageBubble
                content={messages.item.content}
                author={messages.item.author}
                participants={currentConversation.users}
                logged={logged} />
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