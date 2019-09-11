import React, { Component } from 'react';
import { View, Image } from 'react-native';

import logo from '../Assets/eaglelogo.png'

class SplashScreen extends Component {
    performTimeConsumingTask = async() => {
        return new Promise((resolve) =>
            setTimeout(() => { 
                resolve('result') 
            },2000)
        )
    }

    async componentDidMount() {
        const data = await this.performTimeConsumingTask();

        if (data !== null) {
        this.props.navigation.navigate('AppNavigator');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={logo} />
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF'
    },
}

export default SplashScreen;