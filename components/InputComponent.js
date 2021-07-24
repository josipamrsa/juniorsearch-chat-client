import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

const InputComponent = (props) => {

    return (
        <View style={{...inputStyle.input, ...props.inputWidth}}>
            <TextInput {...props}/>
        </View>
    )
};

const inputStyle = StyleSheet.create({
    input: {
        padding: 10,
        backgroundColor: "lightgray",
        marginBottom: 5,
        width: "100%",
        borderRadius: 10
    }
});

export default InputComponent;