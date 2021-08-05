import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import InputComponent from './InputComponent';
import CustomizableButton from './CustomizableButton';

const MessageInput = (props) => {
    const checkContent = (data) => props.setContent(data); 
    return (
        <View style={inputStyle.area}>
            <InputComponent
                value={props.content}
                onChangeText={checkContent}
                placeholder="Write a message..."
                inputWidth={{ width: "80%", marginRight: 5 }} />

            <CustomizableButton
                button={inputStyle.sendButton}
                description={"Send"}
                action={props.sendMessage} />
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
        width: "20%"
    }
});

export default MessageInput;