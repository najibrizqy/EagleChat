import React, { Component } from 'react';
import { StyleSheet, View, Text } from "react-native";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default class Maps extends Component{
    render(){
        return(
            <View style={styles.container}>
                <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                region={{
                    latitude: -7,
                    longitude: 110,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                >
                </MapView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        height: '100%',
        width: '100%',
    },
});