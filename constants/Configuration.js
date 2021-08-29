//----BASE ROUTE----//
//export const BASE_ROUTE = "http://192.168.0.11:3001";
//export const BASE_ROUTE = "http://192.168.43.71:3001";
//export const BASE_ROUTE = `https://rn-chat-server.herokuapp.com`;
export const BASE_ROUTE = "http://192.168.43.71:3002";

//----SOCKET SERVER URL----//
//export const SOCKET_SERVER_URL = "http://192.168.0.11:3001";
//export const SOCKET_SERVER_URL = "http://192.168.43.71:3001";
//export const SOCKET_SERVER_URL = "https://rn-chat-server.herokuapp.com/";
export const SOCKET_SERVER_URL = "http://192.168.43.71:3002";

//----SERVER ROUTES----//
export const SIGN_IN_URL = `${BASE_ROUTE}/api/login`;
export const USER_URL = `${BASE_ROUTE}/api/users`;
export const MESSAGE_URL = `${BASE_ROUTE}/api/message`;
export const CONVERSATION_URL = `${BASE_ROUTE}/api/convo`;

//----EXPO PUSH SERVER----//
export const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
