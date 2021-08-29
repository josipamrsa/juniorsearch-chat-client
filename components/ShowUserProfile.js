//----KONFIGURACIJA----//
import React, {
    useState,
    useEffect
} from 'react';

import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

//----KOMPONENTE----//
import OnlineStatus from './OnlineStatus';
import CircleProfilePicture from './CircleProfilePicture';
import UserDetailGridCard from './UserDetailGridCard';

//----GLAVNA KOMPONENTA----//
const ShowUserProfile = (props) => {
    //----STANJA----//
    const [userData, setUserData] = useState("");       // Korisnički podaci
    const [firstName, setFirstName] = useState("U");    // Inicijal imena (Unknown)
    const [lastName, setLastName] = useState("U");      // Inicijal prezimena (User)

    //----METODE----//

    // Učitavanje podataka iz AsyncStorage
    const readData = async (key) => {
        try {
            const data = await AsyncStorage.getItem(`@${key}`);
            return JSON.parse(data);
        } catch (err) { console.log(err.response); }
    }

    // Učitavanje podataka o korisniku
    useEffect(() => {
        readData("JuniorChat_userDetail").then((response) => {
            setUserData(response);
            setFirstName(response.firstName[0]);
            setLastName(response.lastName[0]);
        });
        props.setUpdate(false);
    }, [props.update]);

    // Prikaz detalja o korisniku
    return (
        <View>
            <View style={showProfileStyle.nameHeader}>
                <CircleProfilePicture
                    firstName={firstName}
                    lastName={lastName}
                    circleSize={{ padding: 0 }}
                    imageSize={{ width: 80, height: 80 }}
                    textSize={{ fontSize: 40 }} />

                <Text style={showProfileStyle.userNameArea}>
                    <Text style={showProfileStyle.userName}>{userData.firstName} {userData.lastName} </Text>
                    <OnlineStatus
                        color={userData.activeConnection !== "" ?
                            { backgroundColor: "limegreen" } :
                            { backgroundColor: "lightgray" }
                        } />
                </Text>
            </View>

            <View style={showProfileStyle.detailHeader}>

                <View style={showProfileStyle.detailArea}>
                    <Text style={showProfileStyle.detailTitle}>
                        User details
                    </Text>
                </View>

                <UserDetailGridCard
                    field={"Location:"}
                    data={userData.currentResidence} />

                <UserDetailGridCard
                    field={"Email:"}
                    data={userData.email} />

                <UserDetailGridCard
                    field={"Phone:"}
                    data={userData.phoneNumber} />
            </View>
        </View>
    )
};

//----STILOVI----//
const showProfileStyle = StyleSheet.create({
    nameHeader: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: "#f3f3f3",
        elevation: 5
    },
    userNameArea: {
        alignItems: 'center'
    },
    userName: {
        fontSize: 25
    },
    detailHeader: {
        alignItems: 'center',
        padding: 10,
        marginTop: 10
    },
    detailTitle: {
        fontWeight: "bold",
        fontSize: 25,
        marginBottom: 15,
        color: "tomato",
    },
    detailArea: {
        flexDirection: 'row',
        width: "90%",
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2
    }
});

export default ShowUserProfile;
