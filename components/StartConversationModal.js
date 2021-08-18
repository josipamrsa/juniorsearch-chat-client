import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal
} from 'react-native';

import CustomizableButton from './CustomizableButton';

const StartConversationModal = (props) => {
    const selectedUser = props.selected;
    const loggedUser = props.logged;

    const users = [selectedUser.phoneNumber, loggedUser.phone]

    const startConversation = () => {
        props.startNewConvo(users, loggedUser.token)
            .then((response) => {
                props.setUserList(props.userList.filter(u => u.id !== selectedUser.id));
                props.startedConversation(selectedUser.activeConnection, props.fullName);
            }).catch(err => console.log(err));
    }

    return (
        <Modal
            transparent={true}
            visible={props.visible}
            animationType="slide">

            <View style={convoModalStyle.area}>
                <View style={convoModalStyle.prompt}>
                    <Text style={convoModalStyle.promptText}>Start a conversation with {selectedUser.firstName} {selectedUser.lastName}?</Text>
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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        marginTop: "60%",
        marginLeft: "10%",
        elevation: 5,
        width: "80%",
        padding: 15,
        borderRadius: 20
    },
    header: {
        flexDirection: "row"
    },
    prompt: {
        marginBottom: 20,
    },
    promptText: {  
        textAlign: "center",
        fontSize: 15
    },
    cancelButton: {
        backgroundColor: "tomato",
        width: "35%",
        padding: 15,
        marginLeft: 5
    }
});

export default StartConversationModal;