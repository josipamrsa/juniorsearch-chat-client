//----KONFIGURACIJA----//
import React, {
    useState,
    useEffect
} from 'react';

import {
    StyleSheet,
    FlatList,
    View,
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
import StartConversationModal from '../components/StartConversationModal';  // Modul za pokretanje razgovora

//----EKRAN----//
const DashboardScreen = (props) => {
    //----STANJA----//

    // Prijavljeni korisnik - dohvaćeno s ekrana za prijavu
    const [loggedUser, setLoggedUser] = useState(props.navigation.getParam("user"));

    const [fullName, setFullName] = useState("");           // Puno ime korisnika za modal
    const [update, setUpdate] = useState(false);            // Ažuriranje podataka kod navigacije u tabu
    const [userList, setUserList] = useState([]);           // Lista korisnika - s kojima nije započet razgovor
    const [startConvo, setStartConvo] = useState(false);    // Prikaz modala
    const [selected, setSelected] = useState("");           // Odabrani korisnik za razgovor

    //----WEBHOOK SVOJSTVA I METODE----//
    const {
        sendPushNotification,   // slanje push notifikacija
        expoPushToken           // token dodijeljen uređaju
    } = useExpoPushNotifications();

    const {
        userVerified,           // postavljanje online statusa (aktivna WebSocket veza)
        connectToUser,          // spajanje s drugim korisnikom koji je online (direktno)
        conversationStarted,    // započet razgovor sa korisnikom (ne slanje poruka još)
        notification,           // obavijest
        setNotification         // postavljanje obavijesti
    } = useWebSockets();

    //----METODE----//

    // Spremanje vrijednosti u AsyncStorage
    const storeUserData = async (key, value) => {
        try {
            // Postavi na ključ stringificiranu vrijednost
            await AsyncStorage.setItem(`@${key}`, JSON.stringify(value));
        } catch (err) { }
    }

    // Učitavanje korisničkih podataka
    const loadUserData = () => {
        /*
            1. Dohvati prijavljenog korisnika sa prethodnog ekrana
            2. Provjeri podatke (token) i postavi listu korisnika
               s kojima još nije započet razgovor, puno ime korisnika,
               te podatke spremi u AsyncStorage pod jedinstvenim ključem
            3. Ako korisnik još nema postavljen online status, poziva se 
               metoda iz hooka, koja dohvaća referencu na aktivni socket,
               a onda se postavlja i online status korisnika, te spremaju
               ostali njegovi detalji
            4. Kod svakog poziva servisa vrati grešku ako nešto pođe po
               krivu
        */
        setLoggedUser(props.navigation.getParam("user"));

        authService.setToken(loggedUser.token);
        authService.fetchUserData(loggedUser.phone)
            .then((response) => {
                setUserList(response.notChatted);
                setFullName(response.fullName);
                // TODO - spremiti pod Constants ove stringove
                storeUserData("JuniorChat_user", loggedUser);

                // Ako je korisnik već prijavljen (online), onda ne treba ponovno postavljati njegov status,
                // inače, da nema ovog, referenca za socket poprima vrijednost null pri idućem pokušaju (?)
                // Ovo bi moglo izazvati probleme kod osvježavanja veze (reload ili nepredvidljivi element možda...)
                if (!response.activeConnection) {
                    let socket = userVerified();

                    authService.setOnlineStatus(loggedUser.phone, { socket, onlineTag: true })
                        .then((response) => {
                            console.log(response);
                            storeUserData("JuniorChat_userDetail", response);
                        }).catch(err => console.log(err));
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Osvježavanje putem novih WebSocket notifikacija ili
    // prelaska s jednog tab ekrana na drugi
    useEffect(() => {
        loadUserData();     // Učitavanje korisničkih podataka
        setUpdate(false);   // Označava prijelaz s novog ekrana

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
            startChat={() => {
                // Pokretanje razgovora sa novom osobom (prikaz modala)
                setSelected(user.item);
                setStartConvo(true);
            }}
        />);
    }

    return (
        <View>
            <NavigationEvents onWillFocus={
                /* 
                    Služi za ažuriranje kad se korisnik prebaci s jednog tab ekrana na drugi,
                    pa je onda moguće osvježiti podatke na ekranima koji su u tab navigaciji. 
                    Inače se za to koristi Redux, ali ja preferiram sumnjiva rješenja :) 

                    P.S. TODO - Možda dobro za testirati sigurnost aplikacije s ovim?
                */
                (payload) => { setUpdate(true); }} />

            <StartConversationModal
                visible={startConvo}
                setVisible={setStartConvo}
                selected={selected}
                logged={loggedUser}
                userList={userList}
                fullName={fullName}
                startNewConvo={messagingService.startNewConversation}
                setUserList={setUserList}
                setUpdate={setUpdate}
                startedConversation={conversationStarted}
                connect={connectToUser} />

            <FlatList
                data={userList}
                renderItem={showUsers} />
        </View>

    );
};

export default DashboardScreen;
