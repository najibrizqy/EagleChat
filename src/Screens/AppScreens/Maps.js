import React, { Component } from 'react';
import { StyleSheet, View,PermissionsAndroid, Text, Image } from "react-native";
import MapView, { PROVIDER_GOOGLE, Circle, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { Thumbnail } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

import firebase, {Firestore} from '../../Config/Firebase';
import markerUser from '../../Assets/marker.png';

export default class Maps extends Component{
    constructor(){
        super()
        this.state = {
            users:[],
            region : {
                latitude: -7.7585007,
                longitude: 110.378115,
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
        this.getPosition()
    }

    getPosition = async () => {
        let hasLocationPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        if(!hasLocationPermission){
            hasLocationPermission = await this.requestLocationPermission()
            this.getPosition()
        }
        if(hasLocationPermission){
            Geolocation.watchPosition(
              async (position) => {
                let Position = {
                  latitude:position.coords.latitude,
                  longitude:position.coords.longitude
                }
                await firebase.firestore()
                  .collection('users')
                  .doc(this.state.userId)
                  .update({Position})
                .then(() => {
                    this.setState({
                        region: {...this.state.region, latitude: position.coords.latitude, longitude: position.coords.longitude}
                    })
                })
              },
              (err) => {
                  console.log(err.code, err.message);
              },
              { 
                showLocationDialog: true,
                distanceFilter: 1,
                enableHighAccuracy: true,
                fastestInterval: 5000,
                timeout: 15000,
                maximumAge: 10000 
              }
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
        const {userId} = this.state
        return(
            <View style={styles.container}>
                <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                showsCompass={true}
                zoomControlEnabled={true}
                showsUserLocation={true}
                followsUserLocation={true}
                initialRegion={this.state.region}
                region={this.state.region}
                >
                    {this.state.users.map((user, index) => {
                        if(user.Position.latitude !== null){
                            return (
                                <Marker
                                key={index}
                                title={
                                    user.uid == userId ?
                                        "YOU"
                                    : 
                                        user.username
                                }
                                description={
                                    user.uid == userId ? 
                                        ""
                                    : 
                                        user.full_name
                                }
                                coordinate={user.Position}
                                onCalloutPress={
                                    user.uid == userId ? 
                                        ()=>{console.log(userId)}
                                    :   
                                        ()=>{this.props.navigation.navigate('ChatRoom', {receiverData:user, userId})}
                                }
                                >
                                    {
                                        user.uid ==userId ? 
                                            <View>
                                                <Image source={markerUser} style={styles.markerYou} />
                                            </View>
                                        : 
    
                                        <View>
                                            <Thumbnail small source={{uri: user.image}} style={user.status == "online" ?styles.markerOnline: styles.markerOffline} />
                                        </View>
                                    }
                                </Marker>
                            )
                        }else{
                            return <View></View>
                        }
                        
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
    markerYou:{
        width: 40,
        height: 40,
    },
    markerOnline:{
        borderWidth: 2,
        borderColor: "#42b72a"
    },
    markerOffline:{
        borderWidth: 2,
        borderColor: "gray"
    }
});