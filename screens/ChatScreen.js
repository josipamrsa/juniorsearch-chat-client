//----KONFIGURACIJA----//
import React, {
    useEffect,
    useState
} from 'react';

import {
    FlatList,
    Keyboard,
    StyleSheet,
    View
} from 'react-native';

import { NavigationEvents } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

//----WEBHOOKOVI----//
import useWebSockets from '../hooks/useWebSockets';

//----SERVISI----//
import messagingService from '../services/messagingService';

//----KOMPONENTE----//
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';

//----EKRAN----//
const ChatScreen = (props) => {
    //----STANJA----//
    const [loggedUser, setLoggedUser] = useState("");                       // Prijavljeni korisnik
    const [currentConversation, setCurrentConversation] = useState([]);     // Identifikator razgovora
    const [content, setContent] = useState("");                             // Sadržaj poruke
    const [author, setAuthor] = useState("");                               // Autor poruke
    const [update, setUpdate] = useState(false);                            // Ažuriranje podataka kod navigacije u tabu

    const {
        notification,       // obavijest
        setNotification     // postavljanje obavijesti
    } = useWebSockets();

    const userOnline = props.navigation.getParam('activeConnection');      // Aktivna WebSocket veza za korisnika
    const sendNewMessage = props.navigation.getParam("sendNewMessage");    // Metoda za slanje WebSocket obavijesti/poruke
    const senderFullName = props.navigation.getParam("senderFullName");    // Puno ime korisnika koji šalje poruku

    const users = [
        props.navigation.getParam('loggedPhone'),
        props.navigation.getParam('phoneNumber')
    ];                                                                      // Korisnici koji sudjeluju u razgovoru

    //----METODE----//

    // Povlačenje podataka iz AsyncStorage-a
    const readData = async (key) => {
        try {
            const logged = await AsyncStorage.getItem(`@${key}`);
            let parseLogged = JSON.parse(logged);
            setLoggedUser(parseLogged);
            setAuthor(parseLogged.phone);
        } catch (err) { console.log(err.response); }
    }

    // Osvježavanje putem novih WebSocket notifikacija ili
    // kod uspješno poslane poruke
    useEffect(() => {
        readData("JuniorChat_user");    // Učitavanje podataka iz AsyncStorage-a

        /*
            1. Dohvati ID trenutnog razgovora
            2. Potom invertiraj redoslijed poruka kako bi se najnovije pojavljivale
               na kraju FlatListe
            3. Postavi stanje trenutnog razgovora i stanje za ažuriranje ekrana
            4. Ukoliko dođe do greške, prikaži
        */

        messagingService.getCurrentConversation(users, loggedUser.token)
            .then((response) => {
                let inverse = response;
                inverse.messages = inverse.messages.reverse();
                setCurrentConversation(inverse);
                setUpdate(false);
            })
            .catch((err) => { console.log(err) });

        // Pri primitku nove obavijesti obriši postojeću
        setNotification('');
    }, [notification, update]);

    // Metoda za prikaz poslanih poruka u FlatListi
    const showMessages = (messages) => {
        return (
            <MessageBubble
                content={messages.item.content}
                author={messages.item.author}
                participants={currentConversation.users}
                logged={loggedUser} />
        );
    };

    // Metoda za slanje poruke od jednog korisnika prema drugom
    const sendMessage = () => {
        /*
            1. Dohvati potrebne podatke (sadržaj, autor, datum slanja)
            2. Pošalji prema bazi podataka za spremanje u bazu 
            3. Nakon toga postavi stanje sadržaja na prazno, te stanje 
               ažuriranja i razriješi tipkovnicu
            4. Ako je drugi sudionik online, pošalji obavijest preko
               WebSocket veze da mu se ekran osvježi s novim porukama
            5. Ako nešto ne uspije, prikaži grešku
        */

        const data = {
            content,
            author,
            dateSent: new Date()
        }

        messagingService.saveMessage(data, loggedUser.token, currentConversation.id)
            .then((response) => {
                setContent("");
                setUpdate(true);
                Keyboard.dismiss();
                if (userOnline) {
                    sendNewMessage(userOnline, data, senderFullName);
                }
            }).catch(err => console.log(err));
    }

    return (
        <View style={chatStyle.screen}>
            <NavigationEvents onWillFocus={
                /* 
                    Služi za ažuriranje kad se korisnik prebaci s jednog tab ekrana na drugi,
                    pa je onda moguće osvježiti podatke na ekranima koji su u tab navigaciji. 
                    Inače se za to koristi Redux, ali ja preferiram sumnjiva rješenja :) 

                    P.S. TODO - Možda dobro za testirati sigurnost aplikacije s ovim?
                */
                (payload) => { setUpdate(true); }} />

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

//----OPCIJE ZA NAVIGACIJU----//
ChatScreen.navigationOptions = (navigationData) => {
    // Da se može prikazati ime sudionika razgovora za korisnika
    const userFullName = navigationData.navigation.getParam("userFullName");
    return {
        headerTitle: userFullName
    }
}

//----STILOVI----//
const chatStyle = StyleSheet.create({
    screen: {
        flex: 1,
        width: "100%"
    }
});

export default ChatScreen;
