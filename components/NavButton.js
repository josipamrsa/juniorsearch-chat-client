//----KONFIGURACIJA----//
import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

//----GLAVNA KOMPONENTA----//
const NavButton = (props) => {
    // Prikaz botuna u zaglavlju
    return (
        <HeaderButton 
            {...props}
            IconComponent={Ionicons}
            iconSize={22}
            color={"black"}
        />
    )
};

export default NavButton;