import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import OnlineStatus from './OnlineStatus';
import CircleProfilePicture from './CircleProfilePicture';

const ShowUserProfile = (props) => {

    return (
        <View>
            <View style={showProfileStyle.nameHeader}>
                <CircleProfilePicture
                    firstName={"U"}
                    lastName={"U"}
                    circleSize={{ padding: 0 }}
                    imageSize={{ width: 80, height: 80 }}
                    textSize={{ fontSize: 40 }} />

                <Text style={showProfileStyle.userNameArea}>
                    <Text style={showProfileStyle.userName}>{props.firstName} {props.lastName} </Text>
                    <OnlineStatus
                        color={props.activeConnection !== "" ?
                            { backgroundColor: "limegreen" } :
                            { backgroundColor: "lightgray" }
                        } />

                </Text>
            </View>

            <View style={showProfileStyle.locationHeader}>
                <Text style={showProfileStyle.locationHeaderText}>{props.location}</Text>

            </View>

            <View style={showProfileStyle.contactHeader}>
                {/* TODO - razdvojiti naslove i podatke, da su onako
                broj        091
                email       mail  */}
                <View>
                    <Text>Phone number: {props.phone}</Text>
                    <Text>Email: {props.email}</Text>
                </View>

            </View>

        </View>

    )
};

const showProfileStyle = StyleSheet.create({
    nameHeader: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: "lightgray"
    },

    userNameArea: {
        alignItems: 'center'
    },

    userName: {
        fontSize: 25
    },

    locationHeader: {
        alignItems: 'center',

    },

    locationHeaderText: {
        fontSize: 20,
        fontStyle: "italic",
        color: "gray"
    },

    contactHeader: {
        alignItems: 'center',

    }
});

export default ShowUserProfile;