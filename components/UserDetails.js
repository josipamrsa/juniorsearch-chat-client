//----KONFIGURACIJA----//
import React from 'react';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';

//----KOMPONENTE----//
import CircleProfilePicture from './CircleProfilePicture';
import OnlineStatus from './OnlineStatus';

//----TEME----//
import CurrentTheme from '../constants/CurrentTheme';

//----GLAVNA KOMPONENTA----//
const UserDetails = (props) => {
    // Prikaz detalja o korisnicima na nadzornoj ploči
    return (
        /*
            1. Kad je korisnik na nadzornoj ploči korisnika koji su nekontaktirani, može samo započeti razgovor
            2. Kad je korisnik na nadzornoj ploči kontaktiranih korisnika, može započeti (nastaviti) razgovor,
               te obrisati razgovor
        */
       
        <TouchableOpacity onPress={props.startChat} onLongPress={props.delete}>
            <View style={userDetailsStyle.section}>

                <CircleProfilePicture
                    firstName={props.firstName[0]}
                    lastName={props.lastName[0]}
                    circleSize={{ paddingRight: 20 }}
                    imageSize={{ width: 60, height: 60 }} />

                <View>
                    <Text
                        style={userDetailsStyle.name}>
                        {props.firstName} {props.lastName}
                        <OnlineStatus
                            color={props.onlineStatus ?
                                { backgroundColor: CurrentTheme.USER_ONLINE_COLOR } :
                                { backgroundColor: "lightgray" }
                            } />
                    </Text>

                    <Text
                        style={userDetailsStyle.mail}>
                        {props.email}
                    </Text>

                    <Text
                        style={userDetailsStyle.location}>
                        {props.residence}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

//----STILOVI----//
const userDetailsStyle = StyleSheet.create({
    section: {
        padding: 10,
        marginBottom: 5,
        backgroundColor: CurrentTheme.USER_DETAIL_CONTAINER_COLOR,
        borderRadius: 15,
        elevation: 2,
        flexDirection: "row",
        alignItems: "center",
    },
    name: {
        fontSize: 20,
        color: CurrentTheme.USER_DETAIL_CONTAINER_NAME_COLOR,
    },
    location: {
        fontStyle: "italic",
        color: CurrentTheme.USER_DETAIL_CONTAINER_LOCATION_COLOR,
    },
    mail: {
        color: CurrentTheme.USER_DETAIL_CONTAINER_MAIL_COLOR,
    }
});

export default UserDetails;