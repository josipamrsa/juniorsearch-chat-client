import io from "socket.io-client";
import { SOCKET_SERVER_URL } from "../constants/Configuration";

export const socket = io(SOCKET_SERVER_URL, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelayMax: 10000,
    reconnectionDelay: 500,
    forceNew: true
});