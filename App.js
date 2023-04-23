import React, {useState} from 'react';
// import { StyleSheet, Text, View } from 'react-native';
import env from "./Env"
import {AppLoading} from "expo"
import Navigator from "./routes/homeStack"
import { useFonts } from 'expo-font';




// const getFonts=() => Font.loadAsync({
//   'inter': require('./assets/fonts/Inter-VariableFont_slnt,wght.ttf')
// });


export default function App() {
  const [loaded] = useFonts({
    Inter: require('./assets/fonts/Inter.ttf'),
  });

  if (!loaded) {
    return null;
  }

    return(
      <Navigator/>
    )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
