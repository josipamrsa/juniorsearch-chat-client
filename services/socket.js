//----KONFIGURACIJA----//
import io from "socket.io-client";
import { SOCKET_SERVER_URL } from "../constants/Configuration";

// Socket veza na server
export const socket = io(SOCKET_SERVER_URL);