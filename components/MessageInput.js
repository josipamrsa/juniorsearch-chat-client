import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import InputComponent from './InputComponent';

const MessageInput = (props) => {
    return (
        <View style={inputStyle.area}>
            <InputComponent
                description="Write a message..."
                inputWidth={{ width: "80%", marginRight: 5 }} />

            <TouchableOpacity
                style={inputStyle.sendButton}
                onPress={() => console.log("sent")}>
                <Text style={inputStyle.sendText}>Send</Text>
            </TouchableOpacity>

        </View>
    )
};

const inputStyle = StyleSheet.create({
    area: {
        padding: 10,
        flexDirection: 'row',
        alignItems: "center",
    },
    sendButton: {
        backgroundColor: "blue",
        padding: 15,
        borderRadius: 15
    },
    sendText: {
        color: "white",
    }
});

export default MessageInput;