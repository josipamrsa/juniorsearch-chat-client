import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const OnlineStatus = (props) => {
    return (
        <View style={{...onlineStyle.area, ...props.color}}></View>
    )
};

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