//----KONFIGURACIJA----//
import React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';


const CustomizableButton = (props) => {
    return (
        <TouchableOpacity
            style={{ ...customizableStyle.buttonStyle, ...props.button }}
            onPress={props.action}>
            <Text
                style={{ ...customizableStyle.buttonTextStyle, ...props.buttonText }}>
                {props.description}
            </Text>
        </TouchableOpacity>
    );
}

const customizableStyle = StyleSheet.create({
    buttonStyle: {
        padding: 15,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        width: "100%"
    },
    buttonTextStyle: {
        color: "white",
        textTransform: 'uppercase'
    }
});

export default CustomizableButton;