//----KONFIGURACIJA----//
import React from "react";

import { createStackNavigator } from "react-navigation-stack";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createAppContainer } from "react-navigation";

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

//----WEBHOOKOVI----//
import useWebSockets from "../hooks/useWebSockets";

//----SERVISI----//
import authService from "../services/authService";

//----KOMPONENTE----//
import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MessagedDashboardScreen from "../screens/MessagedDashboardScreen";
import NavButton from '../components/NavButton';

//----TEMA----//
import CurrentTheme from '../constants/CurrentTheme';

//----STACK NAVIGACIJA - NADZORNA PLOČA----//
const UsersStackNavigation = createStackNavigator({
    PrivateMessaging: {
        screen: DashboardScreen,
        navigationOptions: {
            headerTitle: "Private messaging"
        }
    },
});

const MessagedStackNavigation = createStackNavigator({
    MessagedUsers: {
        screen: MessagedDashboardScreen,
        navigationOptions: {
            headerTitle: "Messaged users"
        }
    },
});

const ProfileStackNavigation = createStackNavigator({
    UserProfile: {
        screen: ProfileScreen,
    },
}, {
    // Za slanje inicijalnih parametara određene rute 
    // U ovom slučaju je toggle edit/no edit za profil
    initialRouteParams: {
        editMode: false
    }
});

//----TAB NAVIGACIJA NADZORNE PLOČE - STACK NAVIGATORI----//
const userTabScreens = {
    Profile: {
        screen: ProfileStackNavigation,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return (<Ionicons name={"ios-person"} size={25} color={tabInfo.tintColor} />)
            }
        }
    },

    Users: {
        screen: UsersStackNavigation,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return (<Ionicons name={"ios-people-sharp"} size={25} color={tabInfo.tintColor} />)
            }
        }
    },

    Messaged: {
        screen: MessagedStackNavigation,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return (<Ionicons name={"chatbubble-ellipses"} size={25} color={tabInfo.tintColor} />)
            }
        }
    },
}

//----TAB NAVIGACIJA EKRANA PRIJAVE - STACK NAVIGATORI----//
const signInTabScreens = {
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return (<Ionicons name={"ios-log-in"} size={25} color={tabInfo.tintColor} />)
            }
        }
    },
    Register: {
        screen: RegisterScreen,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return (<Ionicons name={"file-tray-full"} size={25} color={tabInfo.tintColor} />)
            }
        }
    }
}

// Opcije i stilizacija za razne platforme (Android)
const tabOptions = {
    android: {
        activeColor: "white",
        inactiveColor: CurrentTheme.INACTIVE_TAB_COLOR,
        shifting: true,
        barStyle: {
            // Stilizacija TabNavigatora
            backgroundColor: CurrentTheme.MAIN_TAB_COLOR
        }
    }
}

//----TAB NAVIGATORI - WRAPPER----//
const UsersTab = createMaterialBottomTabNavigator(userTabScreens, tabOptions.android);
const LoginRegisterTab = createMaterialBottomTabNavigator(signInTabScreens, tabOptions.android);

//----GLAVNA NAVIGACIJA----//
const ChatNavigation = createStackNavigator({
    SignIn: {
        screen: LoginRegisterTab,
        navigationOptions: {
            headerTitle: "Chat app sign in",
            headerStyle: {
                backgroundColor: CurrentTheme.PRIMARY_HEADER_COLOR
            }
        }
    },
    Dashboard: {
        screen: UsersTab,
        navigationOptions: ({ navigation }) => (
            {
                headerTitle: "Chat app dashboard",
                headerRight: () => {
                    // Dohvat metode za odjavu korisnika - obavijest za WebSocket
                    const { userSignOff } = useWebSockets();

                    // Postavljanje offline statusa korisnika
                    const setOffline = async (key) => {
                        /*
                            1. Dohvati podatke iz AsyncStorage-a
                            2. Preko podataka nađi korisnika i postavi njegov offline status
                            3. Izvjesti o eventualnim greškama
                        */
                        try {
                            const logged = await AsyncStorage.getItem(`@${key}`);
                            let parseLogged = JSON.parse(logged);
                            authService.setOnlineStatus(parseLogged.phone, { onlineTag: false })
                                .then((response) => { }).catch(err => console.log(err)); 
                        } catch (err) { console.log(err); }
                    }

                    // Odjava korisnika
                    const signOutUser = async () => {
                        /*
                            1. Dohvati sve ključeve vezane za ovu aplikaciju 
                            2. Pozovi metodu koja postavlja offline status korisnika
                            3. Nakon toga, ukloni sve ključeve vezane za aplikaciju te njihove
                               vrijednosti - koristi se multiRemove umjesto clear radi slijedećeg
                               https://react-native-async-storage.github.io/async-storage/docs/api#clear
                            4. Makni aktivnu WebSocket vezu
                            5. Vrati korisnika na ekran prijave
                            6. Izvjesti o eventualnim greškama
                        */
                        try {
                            let keys = await AsyncStorage.getAllKeys();
                            setOffline("JuniorChat_user");

                            await AsyncStorage.multiRemove(
                                keys.filter(key => key.includes("JuniorChat"))
                            );
                            
                            userSignOff();
                            navigation.replace("SignIn");
                        } catch (e) { console.log(e); }
                    }

                    return (
                        <HeaderButtons HeaderButtonComponent={NavButton}>
                            <Item
                                title="Sign out"
                                iconName='ios-log-out'
                                onPress={signOutUser} />
                        </HeaderButtons>
                    )
                }
            })
    },

    Profile: {
        screen: ProfileScreen
    },
    ChatWindow: {
        screen: ChatScreen
    },
});

export default createAppContainer(ChatNavigation);