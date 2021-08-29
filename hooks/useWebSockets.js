//----KONFIGURACIJA----//
import { 
    useEffect, 
    useRef, 
    useState 
} from 'react';

//----SERVISI----//
import { socket } from '../services/socket';

//----WEBSOCKET DOGAĐAJI----//
const USER_VERIFIED = "userVerified";
const NEW_USER_LOGGED_IN = "newUserLoggedIn";
const NEW_CONVERSATION_STARTED = "newConversationStarted";
const NEW_PRIVATE_MESSAGE = "newPrivateMessage";
const CONVERSATION_DELETED = "conversationDeleted";
const USER_LOGGED_OUT = "userLoggedOut";

//----WEBHOOK----//
const useWebSockets = () => {
    //----STANJA----//
    const socketRef = useRef();                                 // Referenca na WebSocket
    const [userId, setUserId] = useState("");                   // Socket identifikator korisnika
    const [notification, setNotification] = useState("");       // Stanje obavijesti za klijenta

    //----METODE----//

    // Inicijalizacija klijenta i dohvat događaja
    useEffect(() => {
        // TODO - token!!!!

        /*   
            1. Incijaliziraj socket vezu
            2. Kad se spoji, postavi njegov identifikator u prikladno stanje
            3. Na iduće događaje izvrši slijedeće
                        a. Korisnik se prijavio - upali status online za sučelje
                        b. Korisnik je započeo razgovor - obavijesti sudionika o tome
                        c. Korisnik je poslao poruku - obavijesti sudionika o tome i prikaži poruku
                        d. Korisnik je obrisao razgovor - obavijesti sudionika o tome
                        e. Korisnik se odjavio - ugasi status online za sučelje
            (...) Održavaj vezu sve dok korisnik ne klikne na botun odjave   
        */

        socketRef.current = socket;

        socketRef.current.on('connect', () => {
            setUserId(socketRef.current.id);
        });

        // Update je dovoljan jedanput
        // Svojstvo noPush sprječava duple push obavijesti, s obzirom da je već u sučelju viđena promjena statusa
        socketRef.current.once(NEW_USER_LOGGED_IN, (incoming) => {
            const incomingNotification = { ...incoming, noPush: true };
            setNotification(incomingNotification);
        });

        // Svojstvo noPush dozvoljava više obavijesti da pristignu
        socketRef.current.on(NEW_CONVERSATION_STARTED, (incoming) => {
            const incomingNotification = { ...incoming };
            setNotification({
                notification: `User ${incomingNotification.name} has started a conversation with you.`,
                noPush: false
            });
        });

        // Svojstvo noPush dozvoljava više obavijesti da pristignu
        socketRef.current.on(NEW_PRIVATE_MESSAGE, (incoming) => {
            const incomingMessage = { ...incoming }
            setNotification({
                notification: `New message from ${incomingMessage.name}: ${incomingMessage.message.content}`,
                noPush: false
            });
        });

        // Svojstvo noPush dozvoljava više obavijesti da pristignu
        socketRef.current.on(CONVERSATION_DELETED, (incoming) => {
            const incomingNotification = { ...incoming };
            setNotification({
                notification: `User ${incomingNotification.name} has deleted a conversation with you.`,
                noPush: false
            });
        });

        // Update je dovoljan jedanput
        // Svojstvo noPush sprječava duple push obavijesti, s obzirom da je već u sučelju viđena promjena statusa
        socketRef.current.once(USER_LOGGED_OUT, (incoming) => {
            const incomingNotification = { ...incoming, noPush: true };
            setNotification(incomingNotification);
        });

        return () => {
            console.log(socketRef.current.id);
        }
    }, []);

    //----METODE----//

    // Postavljanje Socketa kada je korisnik verificiran u bazu kao aktivni socket
    const userVerified = () => {
        socketRef.current.emit(USER_VERIFIED, {
            socketId: socketRef.current.id,
        });

        return socketRef.current.id;
    }

    // Pokretanje razgovora sa sudionikom
    const conversationStarted = (participantId, senderName) => {
        const data = {
            participant: participantId,
            senderName: senderName
        };

        socketRef.current.emit(NEW_CONVERSATION_STARTED, data);
    }

    // Slanje poruka prema sudioniku
    const connectToUser = (participantId, message, senderName) => {
        const data = {
            participant: participantId,
            senderName: senderName,
            message
        };

        socketRef.current.emit(NEW_PRIVATE_MESSAGE, data);
    }

    // Brisanje razgovora sa sudionikom
    const conversationDeleted = (participantId, senderName) => {
        const data = {
            participant: participantId,
            senderName: senderName
        };

        socketRef.current.emit(CONVERSATION_DELETED, data);
    }

    // Odjava korisnika
    const userSignOff = () => {
        socketRef.current.disconnect();
    }

    return {
        userId,
        userVerified,
        notification,
        setNotification,
        conversationStarted,
        userSignOff,
        connectToUser,
        conversationDeleted
    }
}

export default useWebSockets;