import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import CircleProfilePicture from './CircleProfilePicture';
import OnlineStatus from './OnlineStatus';

const UserDetails = (props) => {
    console.log(props);
    return (
        <TouchableOpacity onPress={props.startChat}>
            <View style={userDetailsStyle.section}>

                {/* TODO - ne znam hoće li ostati, lijeno mi je radit slike */}
                {/*<View style={userDetailsStyle.picture}>
                    <ImageBackground
                        source={{ uri: defaultPicture }}
                        style={userDetailsStyle.pictureStyle}
                        imageStyle={userDetailsStyle.rounded}>
                    </ImageBackground>
                </View> */}

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
                                { backgroundColor: "limegreen" } :
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

const userDetailsStyle = StyleSheet.create({
    section: {
        padding: 10,
        marginBottom: 5,
        backgroundColor: "white",
        borderRadius: 15,
        elevation: 2,
        flexDirection: "row",
        alignItems: "center",
    },
    name: {
        fontSize: 20,
        color: "tomato",
    },
    location: {
        fontStyle: "italic"
    },
    mail: {
        color: "gray"
    }
});

export default UserDetails;