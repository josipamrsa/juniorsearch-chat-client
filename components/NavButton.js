//----KONFIGURACIJA----//
import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

//----TEME----//
import CurrentTheme from '../constants/CurrentTheme';

//----GLAVNA KOMPONENTA----//
const NavButton = (props) => {
    // Prikaz botuna u zaglavlju
    return (
        <HeaderButton 
            {...props}
            IconComponent={Ionicons}
            iconSize={22}
            color={CurrentTheme.MAIN_TEXT_COLOR}
        />
    )
};

export default NavButton;