//----KONFIGURACIJA----//
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

//----NAVIGACIJA----//
import ChatNavigation from './navigation/ChatNavigation';


export default function App() {

  return (
    <View style={styles.screen}>
      <ChatNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
});
