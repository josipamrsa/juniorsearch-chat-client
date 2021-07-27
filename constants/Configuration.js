//----BASE ROUTE----//
export const BASE_ROUTE = "http://192.168.0.11:3001";
//export const BASE_ROUTE = "http://192.168.43.71:3001";
//export const BASE_ROUTE = `https://rn-chat-server.herokuapp.com`;

//----SERVER ROUTES----//
// it's called a rest api, but I never get no rest
export const SIGN_IN_URL = `${BASE_ROUTE}/api/login`;
export const USER_URL = `${BASE_ROUTE}/api/users`;
export const MESSAGE_URL = `${BASE_ROUTE}/api/message`;
export const CONVERSATION_URL = `${BASE_ROUTE}/api/convo`;

//----SOCKET SERVER URL----//
export const SOCKET_SERVER_URL = "http://192.168.0.11:3001";
//export const SOCKET_SERVER_URL = "http://192.168.43.71:3001";
//export const SOCKET_SERVER_URL = "https://rn-chat-server.herokuapp.com/";
