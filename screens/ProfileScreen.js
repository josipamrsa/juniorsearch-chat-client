//----KONFIGURACIJA----//
import React, {
    useState,
    useEffect
} from 'react';

import {
    StyleSheet,
    View
} from 'react-native';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { NavigationEvents } from 'react-navigation';

//----KOMPONENTE----//
import ShowUserProfile from '../components/ShowUserProfile';
import NavButton from '../components/NavButton';
import EditUserProfile from '../components/EditUserProfile';

//----TEME----//
import CurrentTheme from '../constants/CurrentTheme';

//----EKRAN----//
const ProfileScreen = (props) => {
    //----STANJA----//
    const editMode = props.navigation.getParam("editMode");     // Uređivanje profila
    const [update, setUpdate] = useState(false);                // Ažuriranje podataka kod navigacije u tabu

    //----METODE----//

    useEffect(() => {
        // Označava prijelaz s novog ekrana
        setUpdate(false);
    }, [update])

    return (
        <View style={profStyle.screen}>
            <NavigationEvents onWillFocus={
                /* 
                     Služi za ažuriranje kad se korisnik prebaci s jednog tab ekrana na drugi,
                     pa je onda moguće osvježiti podatke na ekranima koji su u tab navigaciji. 
                     Inače se za to koristi Redux, ali ja preferiram sumnjiva rješenja :) 
 
                     P.S. TODO - Možda dobro za testirati sigurnost aplikacije s ovim?
                 */
                (payload) => { setUpdate(true); }} />

            {
                editMode ?
                    <EditUserProfile
                        update={update}
                        setUpdate={setUpdate} /> :
                    <ShowUserProfile
                        update={update}
                        setUpdate={setUpdate} />
            }
        </View>
    )
};

//----OPCIJE ZA NAVIGACIJU----//
ProfileScreen.navigationOptions = (navigationData) => (
    {
        headerTitle: "User profile",
        // Za toggle efekt - prikaz profila i uređivanje profila
        // Edit mode je inicijalni parametar sa same navigacije
        headerRight: () => {
            return (
                <HeaderButtons HeaderButtonComponent={NavButton}>
                    <Item
                        title="Edit profile"
                        iconName='pencil'
                        onPress={() => {
                            let edit = navigationData.navigation.getParam("editMode");
                            navigationData.navigation.setParams({ editMode: !edit });
                        }} />
                </HeaderButtons>
            );
        }
    });

//----STILOVI----//
const profStyle = StyleSheet.create({
    screen: {
        flex: 1,
        width: "100%",
        backgroundColor: CurrentTheme.MAIN_SCREEN_COLOR
    }
});

export default ProfileScreen;
