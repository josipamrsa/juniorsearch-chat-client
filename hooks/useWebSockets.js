import { useEffect, useRef, useState } from 'react';
import { socket } from '../services/socket';

const USER_VERIFIED = "userVerified";
const NEW_USER_LOGGED_IN = "newUserLoggedIn";
const NEW_CONVERSATION_STARTED = "newConversationStarted";
const NEW_PRIVATE_MESSAGE = "newPrivateMessage";
const CONVERSATION_DELETED = "conversationDeleted";
const USER_LOGGED_OUT = "userLoggedOut";

const useWebSockets = () => {
    const socketRef = useRef();
    const [userId, setUserId] = useState("");
    const [notification, setNotification] = useState("");

    useEffect(() => {
        // TODO - token!!!!
        socketRef.current = socket;

        socketRef.current.on('connect', () => {
            setUserId(socketRef.current.id);
        });

        // za update samo jedanput!
        socketRef.current.once(NEW_USER_LOGGED_IN, (incoming) => {
            console.log("user logged in");
            console.log(incoming);
            const incomingNotification = {
                ...incoming,
                noPush: true
            };

            setNotification(incomingNotification);
        });

        socketRef.current.on(NEW_CONVERSATION_STARTED, (incoming) => {
            console.log("user started conversation");
            console.log(incoming);
            const incomingNotification = { ...incoming };
            setNotification({
                notification: `User ${incomingNotification.name} has started a conversation with you.`,
                noPush: false
            });
        });

        socketRef.current.on(NEW_PRIVATE_MESSAGE, (incoming) => {
            console.log("user sent message");
            console.log(incoming);
            const incomingMessage = { ...incoming }
            setNotification({
                notification: `New message from ${incomingMessage.name}: ${incomingMessage.message.content}`,
                noPush: false
            });
        });

        socketRef.current.on(CONVERSATION_DELETED, (incoming) => {
            console.log("user deleted conversation");
            console.log(incoming);
            const incomingNotification = { ...incoming };
            setNotification({
                notification: `User ${incomingNotification.name} has deleted a conversation with you.`,
                noPush: false
            });
        })

        socketRef.current.once(USER_LOGGED_OUT, (incoming) => {
            console.log("user logged out");
            console.log(incoming);
            const incomingNotification = {
                ...incoming,
                noPush: true
            };

            setNotification(incomingNotification);
        });

        return () => {
            console.log(socketRef.current.id);
        }
    }, []);

    //----METODE----//
    // Postavljanje Socketa kada je korisnik verificiran u bazu
    // kao aktivni socket
    const userVerified = () => {
        socketRef.current.emit(USER_VERIFIED, {
            socketId: socketRef.current.id,
        });

        return socketRef.current.id;
    }

    const conversationStarted = (participantId, senderName) => {
        const data = {
            participant: participantId,
            senderName: senderName
        };

        socketRef.current.emit(NEW_CONVERSATION_STARTED, data);
    }

    const connectToUser = (participantId, message, senderName) => {
        const data = {
            participant: participantId,
            senderName: senderName,
            message
        };

        socketRef.current.emit(NEW_PRIVATE_MESSAGE, data);
    }

    const conversationDeleted = (participantId, senderName) => {
        const data = {
            participant: participantId,
            senderName: senderName
        };

        socketRef.current.emit(CONVERSATION_DELETED, data);
    }

    const userSignOff = () => {
        // TODO - riješiti problem reconnectanja preko queryja kod closing handshake eventa?
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