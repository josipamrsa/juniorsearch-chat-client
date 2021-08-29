//----KONFIGURACIJA----//
import React from 'react';

import { 
    StyleSheet, 
    View 
} from 'react-native';

//----GLAVNA KOMPONENTA----//
const OnlineStatus = (props) => {
    // Element prikaza online statusa korisnika
    return (
        <View style={{...onlineStyle.area, ...props.color}}></View>
    )
};

//----STILOVI----//
const onlineStyle = StyleSheet.create({
    area: {
        backgroundColor: "green",
        width: 10,
        height: 10,
        borderRadius: 25,
        margin: 50
    }
});

export default OnlineStatus;