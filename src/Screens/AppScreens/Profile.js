import React, { Component } from 'react';
import { StyleSheet, View } from "react-native";
import { Container, Button, Text, Content } from 'native-base';
import firebase, {Firestore} from '../../Config/Firebase';
import AsyncStorage from '@react-native-community/async-storage';

export default class Profile extends Component{
    constructor(props){
        super(props)
    }
    
    handleLogout = () => {
        
        firebase.auth().signOut()
        .then( async () => {
            const userToken = await AsyncStorage.getItem('uid');
            await Firestore.collection("users").doc(userToken).update({status: 'offline'})
            this.props.navigation.navigate('SigninScreen')
        })
        .catch(err =>{
            console.log(this.props)
            alert(err)
        })
    }

    render(){
        return(
            <Container>
                <Button danger style={styles.btnLogout} onPress={this.handleLogout}><Text > LOGOUT </Text></Button>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    btnLogout:{
        alignSelf: 'center',
        top: 20
    }
});