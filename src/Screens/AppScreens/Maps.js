import React, { Component } from 'react';
import { StyleSheet, View,PermissionsAndroid, Text, Image } from "react-native";
import MapView, { PROVIDER_GOOGLE, Circle, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { Thumbnail } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

import firebase, {Firestore} from '../../Config/Firebase';
import marker from '../../Assets/marker.png';

export default class Maps extends Component{
    constructor(){
        super()
        this.state = {
            users:[],
            region : {
                latitude: -7.78825,
                longitude: 110.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            userId: null
        }
    }

    unsubsFriendsLocation = Firestore.collection('users').onSnapshot((snapshot) => {
        let users = []
        snapshot.forEach(doc => {
            let data = doc.data()
            data.uid = doc.id
            users.push( data )
        })
        this.setState({users})
    })

    componentWillUnmount() {
        this.unsubsFriendsLocation()
        Geolocation.stopObserving();
    }

    componentDidMount = async () => {
        this.setState({userId: await AsyncStorage.getItem('uid')})
        let hasLocationPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        if(!hasLocationPermission){
            hasLocationPermission = await this.requestLocationPermission()
        }
        if(hasLocationPermission){
            Geolocation.watchPosition(
              (position) => {
                let Position = {
                  latitude:position.coords.latitude,
                  longitude:position.coords.longitude
                }
                firebase.firestore()
                  .collection('users')
                  .doc(this.state.userId)
                  .update({Position})
              },
              (err) => {
                  alert(err.code, err.message);
              },
              { enableHighAccuracy: true, interval: 10000, timeout: 15000, maximumAge: 10000 }
            );
        }
    }

    requestLocationPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message:
                `EagleChat needs permission to get your location.`,
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED
        } catch (err) {
          console.warn(err);
          return false
        }
      }

    render(){
        return(
            <View style={styles.container}>
                <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                showsCompass={true}
                zoomControlEnabled={true}
                showsUserLocation={true}
                followsUserLocation={true}
                initialRegion={this.state.region}
                >
                    {this.state.users.map((user, index) => {
                        return (
                            <Marker
                            key={index}
                            title={user.username}
                            description={user.full_name}
                            coordinate={user.Position}
                            onCalloutPress={()=>{this.props.navigation.navigate('ChatRoom', {receiverData:user, userId:this.state.userId})}}
                            >
                                <View>
                                    <Thumbnail small source={{uri: user.image}} />
                                </View>
                            </Marker>
                        )
                    })}
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