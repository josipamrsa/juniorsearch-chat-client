import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CircleProfilePicture from './CircleProfilePicture';

const MessageBubble = (props) => {
    const authorName = {
        firstName: props.participants.find(p => p.id === props.author).firstName[0],
        lastName: props.participants.find(p => p.id === props.author).lastName[0]
    }

    return (
        <View style={bubbleStyle.frame}>
            <View style={props.author === props.logged ? bubbleStyle.loggedUser : bubbleStyle.otherUser}>
                <CircleProfilePicture
                    firstName={authorName.firstName}
                    lastName={authorName.lastName}
                    circleSize={props.author === props.logged ? {paddingLeft: 5} : {paddingRight: 5}}
                    imageSize={{width: 30, height: 30}}
                    textSize={{fontSize: 10}}
                />
                <Text
                    style={
                        props.author === props.logged ?
                            bubbleStyle.loggedUserText :
                            bubbleStyle.otherUserText
                    }>{props.content}</Text>
            </View>
        </View>
    )
};

const bubbleStyle = StyleSheet.create({
    frame: {
        flex: 1,
        padding: 10,
        width: "100%",
    },

    loggedUser: {
        justifyContent: "flex-start",
        alignItems: "flex-end",
        flexDirection: "row-reverse"
    },

    otherUser: {
        justifyContent: "flex-start",
        alignItems: "flex-end",
        flexDirection: "row"
    },

    loggedUserText: {
        backgroundColor: "tomato",
        padding: 15,
        borderRadius: 15,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 5,
        textAlign: "right",
        maxWidth: 250
    },

    otherUserText: {
        backgroundColor: "lightgray",
        padding: 15,
        borderRadius: 15,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 5,
        textAlign: "left",
        maxWidth: 250
    }
});

export default MessageBubble;