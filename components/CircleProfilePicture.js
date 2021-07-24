import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CircleProfilePicture = (props) => {
    return (
        <View style={{...circleStyle.circleElement, ...props.circleSize}}>
                    <View style={{...circleStyle.letterCircle, ...props.imageSize}}>
                        <Text
                            style={{...circleStyle.letterCircleText, ...props.textSize}}>
                            {props.firstName + props.lastName}</Text>
                    </View>
                </View>
    )
};

const circleStyle = StyleSheet.create({
    circleElement: {
        padding: 0
    },
    letterCircle: {
        borderRadius: 50,
        backgroundColor: "blue",
        width: 0,
        height: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    letterCircleText: {
        fontSize: 20,
        color: "white"
    },
});

export default CircleProfilePicture;