import { useEffect, useRef, useState } from 'react';
import { socket } from '../services/socket';

const USER_VERIFIED = "userVerified";
const NEW_USER_LOGGED_IN = "newUserLoggedIn";
const NEW_PRIVATE_MESSAGE = "newPrivateMessage";

const useWebSockets = () => {
    const socketRef = useRef();
    const [userId, setUserId] = useState("");
    const [notification, setNotification] = useState("");

    useEffect(() => {
        // TODO - token!!!!
        socketRef.current = socket;

        socketRef.current.on('connect', () => {
            console.log("...connecting");
            setUserId(socketRef.current.id);
        });

        socketRef.current.on(NEW_USER_LOGGED_IN, (incoming) => {
            const incomingNotification = { ...incoming };
            setNotification(incomingNotification);
        });

        socketRef.current.on(NEW_PRIVATE_MESSAGE, (incoming) => {
            console.log(`to >> ${socketRef.current.id} >> from >> ${incoming}`);
        })

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

    const connectToRoom = (participantId) => {
        console.log(`from: ${socketRef.current.id}`);
        console.log(`to: ${participantId}`);
        socketRef.current.emit(NEW_PRIVATE_MESSAGE, {
            participant: participantId
        });
    }

    const userSignOff = () => {
        socketRef.current.disconnect();
    }

    return {
        userId,
        userVerified,
        notification,
        userSignOff,
        connectToRoom
    }
}

export default useWebSockets;