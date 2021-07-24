import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import { CONVERSATIONS } from '../test-data/dummyData';

const ChatScreen = (props) => {
    const currentConversation = CONVERSATIONS.find(c => c.id === "r1");
    const logged = currentConversation.users.find(u => u.id === "1").id;
    console.log(currentConversation);

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

const chatStyle = StyleSheet.create({
    screen: {
        flex: 1,
        width: "100%"
    }
});

export default ChatScreen;