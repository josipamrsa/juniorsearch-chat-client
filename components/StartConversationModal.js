import React from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import CustomizableButton from './CustomizableButton';

import { NavigationActions } from 'react-navigation'; // za ugniježđenu navigaciju
//import messagingService from '../services/messagingService';

const StartConversationModal = (props) => {
    const selectedUser = props.selected;
    const loggedUser = props.logged;

    const users = [selectedUser.phoneNumber, loggedUser.phone]

    const startConversation = () => {
        props.startNewConvo(users, loggedUser.token)
            .then((response) => {
                props.setUserList(props.userList.filter(u => u.id !== selectedUser.id));
                props.startedConversation(selectedUser.activeConnection);
            }).catch(err => console.log(err));
    }

    return (
        <Modal
            transparent={true}
            visible={props.visible}
            animationType="slide">

            <View style={convoModalStyle.area}>
                <View>
                    <Text>Start a conversation with {selectedUser.firstName} {selectedUser.lastName}?</Text>
                </View>

                <View style={convoModalStyle.header}>
                    <CustomizableButton
                        button={convoModalStyle.cancelButton}
                        description={"OK"}
                        action={() => {
                            startConversation();
                            props.setVisible(false);
                        }} />

                    <CustomizableButton
                        button={convoModalStyle.cancelButton}
                        description={"Cancel"}
                        action={() => {
                            props.setVisible(false);
                        }} />
                </View>
            </View>
        </Modal>
    )
};

const convoModalStyle = StyleSheet.create({
    area: {
        backgroundColor: "white",
        height: "20%",
        marginTop: "50%",
        marginLeft: "10%",
        width: "75%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        borderRadius: 25,
        elevation: 5
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButton: {
        backgroundColor: "tomato",
        width: "20%",
        margin: 5
    }
});

export default StartConversationModal;