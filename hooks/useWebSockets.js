import { useEffect, useRef, useState } from 'react';
import { socket } from '../services/socket';

const USER_VERIFIED = "userVerified";
const NEW_USER_LOGGED_IN = "newUserLoggedIn";
const DATA_UPDATE_AVAILABLE = "dataUpdateAvailable";
const NEW_CONVERSATION_STARTED = "newConversationStarted";
const NEW_PRIVATE_MESSAGE = "newPrivateMessage";
const USER_LOGGED_OUT = "userLoggedOut";

const useWebSockets = () => {
    const socketRef = useRef();
    const [userId, setUserId] = useState("");
    const [notification, setNotification] = useState("");
    const [update, setUpdate] = useState(false);
    
    useEffect(() => {
        // TODO - token!!!!
        socketRef.current = socket;

        socketRef.current.on('connect', () => {
            console.log("...connecting");
            setUserId(socketRef.current.id);
        });

        // za update samo jedanput!
        socketRef.current.once(NEW_USER_LOGGED_IN, (incoming) => {
            const incomingNotification = { ...incoming };
            setNotification(incomingNotification);
        });

        socketRef.current.on(DATA_UPDATE_AVAILABLE, (incoming) => {
            const id = { ...incoming };
            setUpdate(`updating data for ${id}`);
        });

        socketRef.current.on(NEW_CONVERSATION_STARTED, (incoming) => {
            //console.log(`CONVERSATION: TO USER >> ${socketRef.current.id} >> FROM USER >> ${incoming.sender}`);
            const incomingNotification = { ...incoming };
            setNotification(`User ${incomingNotification.sender} has started a conversation with you.`);
        })

        socketRef.current.on(NEW_PRIVATE_MESSAGE, (incoming) => {
            //console.log(`MESSAGE: TO USER >> ${socketRef.current.id} >> FROM USER >> ${incoming.sender}`);
            const incomingMessage = { ...incoming }
            setNotification(`New message from ${incomingMessage.sender}: ${incomingMessage.message.content}`);
        });

        socketRef.current.on(USER_LOGGED_OUT, (incoming) => {
            const incomingNotification = { ...incoming };
            setNotification(incomingNotification);
        });

        return () => { socketRef.current.disconnect(); }
    }, []);

    //----METODE----//
    // Postavljanje Socketa kada je korisnik verificiran u bazu
    // kao aktivni socket - TODO
    const updateData = () => {
        socketRef.current.emit(DATA_UPDATE_AVAILABLE, socketRef.current.id);
    }

    const userVerified = () => {
        socketRef.current.emit(USER_VERIFIED, {
            socketId: socketRef.current.id
        });
        return socketRef.current.id;
    }

    const conversationStarted = (participantId) => {
        //console.log("STARTED CONVERSATION");
        //console.log("From: " + socketRef.current.id);
        //console.log("To: " + participantId);

        const data = {
            participant: participantId,
        };

        socketRef.current.emit(NEW_CONVERSATION_STARTED, data);
    }

    const connectToUser = (participantId, message) => {
        //console.log("PRIVATE MESSAGE");
        //console.log("From: " + socketRef.current.id);
        //console.log("To: " + participantId);

        const data = {
            participant: participantId,
            message
        };

        socketRef.current.emit(NEW_PRIVATE_MESSAGE, data);
    }

    const userSignOff = () => {
        socketRef.current.emit(USER_LOGGED_OUT, {
            socketId: socketRef.current.id
        });
        socketRef.current.disconnect();
    }

    return {
        userId,
        userVerified,
        notification,
        conversationStarted,
        userSignOff,
        connectToUser,
        updateData,
        update,
        setUpdate
    }
}

export default useWebSockets;