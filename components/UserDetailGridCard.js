import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const UserDetailGridCard = (props) => {
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
        color: "black"
    },
    detailText: {
        fontSize: 18,
        color: "black",
        width: "65%",
        backgroundColor: "#eaeaea",
        borderRadius: 5,
        padding: 5
    }
});

export default UserDetailGridCard;