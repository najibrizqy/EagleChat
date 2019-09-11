import React from 'react';
import { StyleSheet, View, Text, Image } from "react-native";

import headerLogo from '../Assets/header.png'

const Header = () => {
    return(
        <View style={styles.header}>
            <Image source={headerLogo} style={styles.logo}/>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 50,
        backgroundColor: '#3498db',
        padding: 10,
        paddingBottom: 5,
        borderWidth: 0,
    },
    logo:{
        width: 150,
        height: 35
    }
})