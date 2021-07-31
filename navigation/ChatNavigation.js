import React from "react";

import { createStackNavigator } from "react-navigation-stack";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createAppContainer } from "react-navigation";

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import useWebSockets from "../hooks/useWebSockets";
import authService from "../services/authService";

import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MessagedDashboardScreen from "../screens/MessagedDashboardScreen";

import NavButton from '../components/NavButton';

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
    // za slanje inicijalnih parametara određene rute - u ovom slučaju je toggle edit/no edit za profil!
    initialRouteParams: { editMode: false } 
});

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
    }
}

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

const tabOptions = {
    android: {
        activeColor: "white",
        shifting: true
    }
}

const UsersTab = createMaterialBottomTabNavigator(userTabScreens, tabOptions.android);
const LoginRegisterTab = createMaterialBottomTabNavigator(signInTabScreens, tabOptions.android);

const ChatNavigation = createStackNavigator({
    SignIn: {
        screen: LoginRegisterTab,
        navigationOptions: {
            headerTitle: "Chat app sign in"
        }
    },
    Dashboard: {
        screen: UsersTab,
        navigationOptions: ({ navigation }) => (
            {
                headerTitle: "Chat app dashboard",
                headerRight: () => {
                    const { userSignOff, setUpdate } = useWebSockets();

                    const setOffline = async (key) => {
                        try {
                            const logged = await AsyncStorage.getItem(`@${key}`);
                            let parseLogged = JSON.parse(logged);

                            authService.setOnlineStatus(parseLogged.phone, { onlineTag: false })
                                .then((response) => {
                                    console.log(response);
                                }).catch(err => console.log(err));
                        } catch (err) { console.log(err); }
                    }

                    const signOutUser = async () => {

                        try {
                            // dohvati sve ključeve
                            let keys = await AsyncStorage.getAllKeys();
                            setOffline("JuniorChat_user");
                            //setUpdate(false);
                            // koristi se ovo umjesto clear - https://react-native-async-storage.github.io/async-storage/docs/api#clear
                            await AsyncStorage.multiRemove(
                                keys.filter(key => key.includes("JuniorChat"))
                            );
                            // makni aktivnu socket vezu (?)
                            userSignOff();
                            // vrati se na login ekran
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