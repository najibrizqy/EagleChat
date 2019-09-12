import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from "react-native";
import { Container, Content, Tab, Tabs } from 'native-base';

import Header from '../../Components/Header';
import Maps from './Maps';
import Friends from './Friends';
import Profile from './Profile';

export default class HomeTabs extends Component {
  render() {
    return (
      <Container>
        <Header />
        <Tabs style={Platform.OS === 'android' ? { overflow: 'hidden' } : null}>
          <Tab heading="Maps" tabStyle={styles.color} activeTabStyle={styles.color} >
            <Maps navigation={this.props.navigation} />
          </Tab>
          <Tab heading="Friends" tabStyle={styles.color} activeTabStyle={styles.color}>
            <Friends navigation={this.props.navigation} />
          </Tab>
          <Tab heading="Profile" tabStyle={styles.color} activeTabStyle={styles.color}>
            <Profile navigation={this.props.navigation} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  color: {
    backgroundColor: '#3498db',
    borderWidth: 0
  },
});

