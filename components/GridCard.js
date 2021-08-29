//----KONFIGURACIJA----//
import React from 'react';

import { 
    StyleSheet, 
    View 
} from 'react-native';

//----GLAVNA KOMPONENTA----//
const GridCard = (props) => {
    // Bazni kartični prikaz
    return (
        <View style={gridCardStyle.area}>
            {props.children}
        </View>
    )
};

//---STILOVI----//
const gridCardStyle = StyleSheet.create({
    area: {
        width: "80%",
        flexDirection: "column",
        justifyContent: "space-evenly",
        padding: 10,
    }
});

export default GridCard;