import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Header(props) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerText}>{props.title}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    header:{
        width: '100%',
        height: '100%',
        flexDirection:"row",
        alignItems: "center",
        justifyContent: "center"
    },

    headerText:{
        fontSize:20,
        fontFamily:"Inter",
        fontWeight:"bold",
        
    }
})