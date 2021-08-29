//----KONFIGURACIJA----//
import {
    useState,
    useEffect,
    useRef
} from "react";

import {
    Alert,
    Platform
} from 'react-native';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

//----KONSTANTE----//
import { EXPO_PUSH_URL } from '../constants/Configuration';

// Postavke push obavijesti (alert, zvuk, itd.)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false
    })
});

//----WEBHOOK----//
const useExpoPushNotifications = () => {
    //----STANJA----//
    const [expoPushToken, setExpoPushToken] = useState('');     // Token za identifikaciju uređaja
    const [notification, setNotification] = useState(false);    // Obavijesti WebSocket veze
    const notificationListener = useRef();                      // Osluškivač novih obavijesti
    const responseListener = useRef();                          // Osluškivač novih odgovora

    //----METODE----//

    // Osluškivanje i prikaz novih obavijesti
    useEffect(() => {
        /*
            1. Registriraj uređaj za novi token
            2. Osluškivaj nove obavijesti i odgovore na obavijesti (pretplata)
            3. Pri kraju rada s aplikacijom, ukloni pretplatu na obavijesti
        */

        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        }
    }, []);

    // Slanje push obavijesti
    const sendPushNotification = async (expoToken, incoming) => {
        /*
            1. Dohvati detalje primljene obavijesti iz WebSocket-a
            2. Pošalji kao push notifikaciju korisniku
        */

        // zbog update dependencyja unutar komponenti tabularne navigacije aktivira 
        // se konstantno push notifikacija prema korisniku koji poduzima akcije; ovo bi trebalo raditi
        if (!incoming) return;

        const message = {
            to: expoToken,
            sound: 'default',
            title: "React Native Chat",
            body: incoming.notification
        }

        // TODO - preko axiosa...
        await fetch(EXPO_PUSH_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });
    }

    // Registracija uređaja za primanje push obavijesti
    const registerForPushNotificationsAsync = async () => {
        /*
            1. Generiraj svojstvo za token
            2. Ako je fizički uređaj, onda pokušaj dobiti dopuštenje
                    a. Dohvati listu trenutnih dopuštenja vezano za obavijesti
                    b. Ako nema dopuštenja, postavi korisniku upit za dozvolu prikaza takvih obavijesti
                    c. Ako i dalje nema dozvole, obavijesti korisnika o greški
                    d. Ako ima dozvole, onda dohvati novi token za taj uređaj
            3. Ako nije fizički uređaj, prikaži grešku
            4. Ako je platforma Android, postavi neke značajke obavijesti
            5. Vrati novostvoreni token
        */

        let token;

        if (Constants.isDevice) {
            const { 
                status: existingStatus 
            } = await Notifications.getPermissionsAsync();

            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert(
                    "Permission denied",
                    "Failed to get push token for push notifications!",
                    [{
                        text: 'OK',
                        onPress: () => console.log('fail')
                    }]
                );
                return;
            }

            token = (await Notifications.getExpoPushTokenAsync()).data;
        }

        else {
            Alert.alert(
                "Incompatible device",
                "Must use physical device for push notifications!",
                [{
                    text: 'OK',
                    onPress: () => console.log('fail')
                }]
            );
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: "default",                                    // Ime koje će se prikazivati za tu aplikaciju
                importance: Notifications.AndroidImportance.MAX,    // Važnost obavijesti za tu aplikaciju
                vibrationPattern: [0, 250, 250, 250],               // Uzorak vibracije za primitak obavijesti
                lightColor: '#FF231F7C'                             // Boja svjetla ako uređaj podržava
            });
        }

        return token;
    }

    return {
        sendPushNotification,
        expoPushToken
    }
}

export default useExpoPushNotifications;