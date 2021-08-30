//----KONFIGURACIJA----//
import React from 'react';

import {
    StyleSheet,
    Text,
    View,
    Modal
} from 'react-native';

//----KOMPONENTE----//
import CustomizableButton from './CustomizableButton';

//----TEME----//
import CurrentTheme from '../constants/CurrentTheme';

//----GLAVNA KOMPONENTA----//
const StartConversationModal = (props) => {
    //----STANJA----//
    const selectedUser = props.selected;                                // Odabrani korisnik za razgovor
    const loggedUser = props.logged;                                    // Prijavljeni korisnik
    const users = [selectedUser.phoneNumber, loggedUser.phone]          // Lista korisnika za stvaranje razgovora

    //----METODE----//

    // Započni razgovor s korisnikom
    const startConversation = () => {
        /*
            1. Stvori novi razgovor u bazi podataka
            2. Ažuriraj podatke u listi korisnika, te pošalji obavijest drugom
               sudioniku o početku razgovora (poslat će se ako je online)
            3. Eventualne greške prikaži
        */

        props.startNewConvo(users, loggedUser.token)
            .then((response) => {
                props.setUserList(props.userList.filter(u => u.id !== selectedUser.id));
                props.startedConversation(selectedUser.activeConnection, props.fullName);
            }).catch(err => console.log(err));
    }

    // Modalni prozor za započinjanje razgovora
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
                        button={convoModalStyle.okButton}
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

//----STILOVI----//
const convoModalStyle = StyleSheet.create({
    area: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: CurrentTheme.MODAL_WINDOW_COLOR,
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
        fontSize: 15,
        color: CurrentTheme.MODAL_WINDOW_TEXT_COLOR
    },
    okButton: {
        backgroundColor: CurrentTheme.SECOND_BUTTON_COLOR,
        width: "35%",
        padding: 15,
        marginLeft: 5
    },
    cancelButton: {
        backgroundColor: CurrentTheme.BUTTON_COLOR,
        width: "35%",
        padding: 15,
        marginLeft: 5
    }
});

export default StartConversationModal;