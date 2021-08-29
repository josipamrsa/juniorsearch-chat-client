//----KONFIGURACIJA----//
import React from 'react';

import { 
    StyleSheet, 
    Text, 
    View 
} from 'react-native';

//----KOMPONENTE----//
import CircleProfilePicture from './CircleProfilePicture';

//----GLAVNA KOMPONENTA----//
const MessageBubble = (props) => {
    //----STANJA----//

    // Ime autora poruke
    const authorName = {
        firstName: props.author.firstName[0],
        lastName: props.author.lastName[0]
    }       

    // Je li poruka stigla od autora ili od drugog korisnika
    const isLogged = props.author.phoneNumber === props.logged.phone;

    // Prikaz oblačića poruke na temelju toga je li poruka od ulogiranog korisnika ili ne
    return (
        <View style={bubbleStyle.frame}>
            <View style={isLogged ? bubbleStyle.loggedUser : bubbleStyle.otherUser}>
                <CircleProfilePicture
                    firstName={authorName.firstName}
                    lastName={authorName.lastName}
                    circleSize={isLogged ? { paddingLeft: 5 } : { paddingRight: 5 }}
                    imageSize={{ width: 30, height: 30 }}
                    textSize={{ fontSize: 10 }}
                />
                <Text
                    style={
                        isLogged ?
                            bubbleStyle.loggedUserText :
                            bubbleStyle.otherUserText
                    }>{props.content}</Text>
            </View>
        </View>
    );
};

//----STILOVI----//
const bubbleStyle = StyleSheet.create({
    frame: {
        flex: 1,
        padding: 10,
        width: "100%",
    },

    loggedUser: {
        justifyContent: "flex-start",
        alignItems: "flex-end",
        flexDirection: "row-reverse",
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
        maxWidth: 250,
    },

    otherUserText: {
        backgroundColor: "lightgray",
        padding: 15,
        borderRadius: 15,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 5,
        textAlign: "left",
        maxWidth: 250,
    }
});

export default MessageBubble;
