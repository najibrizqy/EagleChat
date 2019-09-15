import React, {Component} from 'react';
import { StyleSheet, View, Text, Image } from "react-native";

import headerLogo from '../Assets/eaglechat.png'
import AsyncStorage from '@react-native-community/async-storage';

class Header extends Component  {
    constructor(props){
        super(props)
        this.state = {
            img: null
        }
    }

    componentDidMount = async () => {
        this.setState({
            img: await AsyncStorage.getItem('image')
        })
    }
    
    render(){
        return(
            <View style={styles.header}>
                <Image source={headerLogo} style={styles.logo} width={110} height={25} />
            </View>
        )
    }
}

export default Header;

const styles = StyleSheet.create({
    header: {
        position: 'relative',
        width: '100%',
        height: 50,
        backgroundColor: '#3498db',
        padding: 10,
        paddingTop: 12,
        paddingLeft: 15,
        paddingBottom: 5,
        borderWidth: 0,
        flexDirection: 'row'
    },
})