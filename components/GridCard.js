import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const GridCard = (props) => {
    return (
        <View style={gridCardStyle.area}>
            {props.children}
        </View>
    )
};

const gridCardStyle = StyleSheet.create({
    area: {
        width: "80%",
        flexDirection: "column",
        justifyContent: "space-evenly",
        padding: 10,
    }
});

export default GridCard;