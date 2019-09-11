import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from "react-native";
import { Container, Content, Tab, Tabs } from 'native-base';

import Header from '../../Components/Header';
import Maps from '../../Components/Maps';
import Friend from '../../Components/Friend';
import Profile from '../../Components/Profile';

export default class HomeTabs extends Component {
  render() {
    return (
      <Container>
        <Header />
        <Tabs style={Platform.OS === 'android' ? { overflow: 'hidden' } : null}>
          <Tab heading="Maps" tabStyle={styles.color} activeTabStyle={styles.color} >
            <Maps />
          </Tab>
          <Tab heading="Friend" tabStyle={styles.color} activeTabStyle={styles.color}>
            <Friend />
          </Tab>
          <Tab heading="Profile" tabStyle={styles.color} activeTabStyle={styles.color}>
            <Profile />
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

