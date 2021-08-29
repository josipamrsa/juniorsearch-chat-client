//----KONFIGURACIJA----//
import React from 'react';

import { 
    StyleSheet, 
    View, 
    TextInput 
} from 'react-native';

//----GLAVNA KOMPONENTA----//
const InputComponent = (props) => {
    // Za unos podataka
    return (
        <View style={{ ...inputStyle.input, ...props.inputWidth, ...props.inputStyle }}>
            <TextInput {...props} />
        </View>
    )
};

//---STILOVI----//
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