//----KONFIGURACIJA----//
import React from 'react';

import { 
    StyleSheet, 
    Text, 
    View 
} from 'react-native';

//----TEME----//
import CurrentTheme from '../constants/CurrentTheme';

//----GLAVNA KOMPONENTA----//
const UserDetailGridCard = (props) => {
    // Prikaz detalja o korisniku na profilu
    return (
            <View style={userDetailGridStyle.detailArea}>
                <Text style={userDetailGridStyle.detailTextHeader}>
                    {props.field}
                </Text>

                <Text style={userDetailGridStyle.detailText}>
                    {props.data}
                </Text>
            </View>
    )
};

//----STILOVI----//
const userDetailGridStyle = StyleSheet.create({
    detailArea: {
        flexDirection: 'row',
        width: "90%",
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2
    },
    detailTextHeader: {
        fontSize: 18,
        fontWeight: "bold",
        color: CurrentTheme.USER_PROFILE_DETAILS_HEADER_TEXT_COLOR
    },
    detailText: {
        fontSize: 18,
        color: "black",
        width: "65%",
        backgroundColor: CurrentTheme.USER_PROFILE_DETAILS_COLOR,
        color: CurrentTheme.USER_PROFILE_DETAILS_TEXT_COLOR,
        borderRadius: 5,
        padding: 5
    }
});

export default UserDetailGridCard;