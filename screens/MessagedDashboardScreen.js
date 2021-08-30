//----KONFIGURACIJA----//
import React, { 
    useState, 
    useEffect 
} from 'react';

import { 
    StyleSheet, 
    FlatList, 
    Alert, 
    View 
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';       // Slično LocalStorage kod Web aplikacija
import { NavigationEvents } from 'react-navigation';                        // Za aktivaciju ažuriranja pri prebacivanju tab navigacije

//----WEBHOOKOVI----//
import useWebSockets from '../hooks/useWebSockets';                         // Ostvarivanje WebSocket veze
import useExpoPushNotifications from '../hooks/useExpoPushNotifications';   // Slanje push notifikacija

//----SERVISI----//
import authService from '../services/authService';                          // Autentifikacija korisnika
import messagingService from '../services/messagingService';                // Metode za razmjenu poruka u razgovoru

//----KOMPONENTE----//
import UserDetails from '../components/UserDetails';

//----TEME----//
import CurrentTheme from '../constants/CurrentTheme';

//----EKRAN----//
const MessagedDashboardScreen = (props) => {
    //----STANJA----//
    const [update, setUpdate] = useState(false);            // Ažuriranje podataka kod navigacije u tabu
    const [loggedUser, setLoggedUser] = useState("");       // Prijavljeni korisnik
    const [fullName, setFullName] = useState("");           // Puno ime korisnika za obavijesti
    const [messagedList, setMessagedList] = useState([]);   // Lista korisnika - s kojima je započet razgovor

    //----WEBHOOK SVOJSTVA I METODE----//
    const {
        sendPushNotification,   // slanje push notifikacija
        expoPushToken           // token dodijeljen uređaju
    } = useExpoPushNotifications();


    const {
        notification,           // obavijest
        connectToUser,          // spajanje s drugim korisnikom koji je online (direktno)
        conversationDeleted,    // obavještavanje o obrisanom razgovoru s korisnikom
        setNotification         // postavljanje obavijesti
    } = useWebSockets();


    //----METODE----//

    // Učitavanje podataka iz AsyncStorage-a
    const readUserData = async (key) => {
        /*
            1. Dohvati vrijednost iz AsyncStorage-a po ključu i parsiraj u JSON format
            2. Postavi prijavljenog korisnika, te provjeri njegove podatke
            3. Dohvati ostale podatke te korisnike s kojima je započet razgovor
            4. Ako nešto od ovog ne uspije, prikaži grešku
        */
        try {
            const logged = await AsyncStorage.getItem(`@${key}`);
            let parseLogged = JSON.parse(logged);
            setLoggedUser(parseLogged);

            authService.setToken(parseLogged.token);
            authService.fetchUserData(parseLogged.phone)
                .then((response) => {
                    setMessagedList(response.chatted);
                    setFullName(response.fullName);
                }).catch((err) => {
                    console.log(err.response);
                });
        } catch (err) { console.log(err.response); }
    }

    // Brisanje razgovora
    const deleteConversation = (users, token, connection) => {
        /*
            1. Prikaži upozorenje korisniku prije brisanja razgovora
            2. Ukoliko stisne OK, pokreni metodu za brisanje
        */
       
        Alert.alert(
            "Delete conversation",
            "Are you sure you want to delete this conversation? Conversation will be deleted for both participants!",
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                },
                {
                    text: 'OK',
                    onPress: () => deletePress(users, token, connection)
                }],
            
                // Da ne može izaći iz dijaloškog prozora tapkanjem van granica
            { cancelable: false } 
        );

        // Metoda za brisanje razgovora iz baze i obavještavanje drugog sudionika razgovora
        const deletePress = (u, t) => {
            messagingService.getCurrentConversation(u, t).then((response) => {
                const c = response.id;
                messagingService.deleteConversation(u, t, c)
                    .then((response) => {
                        setMessagedList(messagedList.filter(m => !u.includes(m.phoneNumber)));
                        conversationDeleted(connection, fullName);
                    }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }
    }

    // Osvježavanje putem novih WebSocket notifikacija ili
    // prelaska s jednog tab ekrana na drugi
    useEffect(() => {
        readUserData("JuniorChat_user");     // Učitavanje korisničkih podataka iz AsyncStorage-a
        setUpdate(false);                    // Označava prijelaz s novog ekrana

        // Obavijesti koje se ne trebaju slati jer su vidljive
        // u aplikaciji odmah su prijavljeni i odjavljeni korisnici
        if (!notification.noPush)
            sendPushNotification(expoPushToken, notification);

        // Pri primitku nove obavijesti obriši postojeću
        setNotification('');
    }, [notification, update]);

    // Metoda za prikaz korisnika u FlatListi
    const showUsers = (user) => {
        return (<UserDetails
            firstName={user.item.firstName}
            lastName={user.item.lastName}
            email={user.item.email}
            residence={user.item.currentResidence}
            phoneNumber={user.item.phoneNumber}
            onlineStatus={user.item.activeConnection}
            delete={() => {
                // Metoda za dohvat korisnika s kojim je započet
                // razgovor, kako bi se taj razgovor mogao obrisati
                let users = [loggedUser.phone, user.item.phoneNumber];
                deleteConversation(users, loggedUser.token, user.item.activeConnection);
            }}
            startChat={() => {
                // Metoda za otvaranje chat prozora s drugim korisnikom

                /*  
                    Potrebno je poslati broj telefona kao jedinstveni identifikator,
                    broj telefona korisnika s kojim se započinje razgovor, aktivni socket
                    identifikator sudionika ako je online, puno ime korisnika koji 
                    započinje razgovor, te korisnika sudionika, i na kraju metodu
                    koja će slati poruke ostvarenom WebSocket vezom 
                */
               
                props.navigation.navigate({
                    routeName: "ChatWindow",
                    params: {
                        loggedPhone: loggedUser.phone,
                        phoneNumber: user.item.phoneNumber,
                        activeConnection: user.item.activeConnection,
                        userFullName: `${user.item.firstName} ${user.item.lastName}`,
                        senderFullName: fullName,
                        sendNewMessage: (participant, message, name) =>
                            connectToUser(participant, message, name)
                    }
                })
            }}
        />);
    }

    return (
        <View style={messagedStyle.container}>
            <NavigationEvents onWillFocus={
                /* 
                    Služi za ažuriranje kad se korisnik prebaci s jednog tab ekrana na drugi,
                    pa je onda moguće osvježiti podatke na ekranima koji su u tab navigaciji. 
                    Inače se za to koristi Redux, ali ja preferiram sumnjiva rješenja :) 

                    P.S. TODO - Možda dobro za testirati sigurnost aplikacije s ovim?
                */
                (payload) => { setUpdate(true); }} />

            <FlatList
                data={messagedList}
                renderItem={showUsers} />
        </View>
    );
};

const messagedStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CurrentTheme.MAIN_SCREEN_COLOR
    }
});

export default MessagedDashboardScreen;