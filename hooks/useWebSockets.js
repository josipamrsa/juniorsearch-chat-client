import { useEffect, useRef, useState } from 'react';
import { socket } from '../services/socket';

const USER_VERIFIED = "userVerified";
const NEW_USER_LOGGED_IN = "newUserLoggedIn";
const UPDATE_USERS_ONLINE_STATUS = "updateUsersOnlineStatus";
const NEW_PRIVATE_MESSAGE = "newPrivateMessage";
const USER_LOGGED_OUT = "userLoggedOut";

const useWebSockets = () => {
    const socketRef = useRef();
    const [userId, setUserId] = useState("");
    const [notification, setNotification] = useState("");
    const [update, setUpdate] = useState(false);
    const [messages, setMessages] = useState([]);

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

        socketRef.current.on(UPDATE_USERS_ONLINE_STATUS, () => {
            setUpdate(true);
        })

        socketRef.current.on(NEW_PRIVATE_MESSAGE, (incoming) => {
            console.log(`to >> ${socketRef.current.id} >> from >> ${incoming.sender}`);
            console.log(`${incoming.message}`);
            //const incomingMessage = { ...incoming.message }
            //setMessages(messages => [...messages, incomingMessage]);
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
    const userVerified = () => {
        socketRef.current.emit(USER_VERIFIED, {
            socketId: socketRef.current.id
        });
        return socketRef.current.id;
    }

    const updateStatus = () => {
        socketRef.current.emit(UPDATE_USERS_ONLINE_STATUS);
    }

    const connectToUser = (participantId, message) => {
        console.log(`from: ${socketRef.current.id}`);
        console.log(`to: ${participantId}`);
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
        update,
        setUpdate,
        updateStatus,
        userSignOff,
        connectToUser
    }
}

export default useWebSockets;