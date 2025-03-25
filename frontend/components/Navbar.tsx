import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Navbar() {
  const router = useRouter()
  const goHome = () => {
    router.push('/')
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={goHome}>
        <Icon name="home" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    navbar: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width:"100%",
      height:50,
      backgroundColor: '#333',
      padding: 10,
      borderBottomLeftRadius: 15,  // Rounded bottom-left corner
      borderBottomRightRadius: 15, // Rounded bottom-right corner
      shadowColor: '#000',  // Black shadow
      shadowOffset: { width: 0, height: 4 },  // Vertical shadow
      shadowOpacity: 0.25,  // Slight opacity for the shadow
      shadowRadius: 3.5,    // Blur effect for the shadow
      elevation: 5,         // For Android shadow support
    },
  });
  