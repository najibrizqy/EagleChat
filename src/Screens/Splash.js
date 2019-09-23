import React, {Component} from 'react';
import {View, Image, Text} from 'react-native';

import splash from '../Assets/splash.jpg';

class SplashScreen extends Component {
  performTimeConsumingTask = async () => {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve('result');
      }, 2000),
    );
  };

  async componentDidMount() {
    const data = await this.performTimeConsumingTask();

    if (data !== null) {
      this.props.navigation.navigate('AppNavigator');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={splash} style={styles.splash} />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  splash: {
    width: '100%',
    height: '100%',
  },
};

export default SplashScreen;