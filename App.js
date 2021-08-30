//----KONFIGURACIJA----//
import React from 'react';

import { 
  StyleSheet, 
  View 
} from 'react-native';

//----NAVIGACIJA----//
import ChatNavigation from './navigation/ChatNavigation';

//---GLAVNA KOMPONENTA----//
export default function App() {
  // Container za aplikaciju
  // Kod navigacije je odmah moguće postaviti light ili dark mode
  return (
    <View style={styles.screen}>
      <ChatNavigation />
    </View>
  );
}

//----STILOVI----//
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
