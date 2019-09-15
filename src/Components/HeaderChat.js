import React, {Component} from 'react';
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Thumbnail, Text, Icon } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

class HeaderChat extends Component {
    constructor(props){
        super(props)
        this.state= {
            userData: props.receiverData
        }
    }

    render(){
        const name = this.props.receiverData.username;
        const status = this.props.receiverData.status;
        const image = this.props.receiverData.image;
        return(
            <View style={styles.header}>
                <Icon type="AntDesign" name="arrowleft" style={styles.backIcon} onPress={() => this.props.navigation.goBack()}/>
                <TouchableOpacity activeOpacity={1} style={styles.wrapper} onPress={() => {this.props.navigation.navigate('UserProfile', {userData: this.state.userData})}}>
                    <Thumbnail source={{ uri: `${image}` }} style={{width: 40, height: 40}}/>
                    <View style={styles.info}>
                        <Text style={styles.name}>{name}</Text>
                        <Text note style={styles.status}>{status}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 60,
        backgroundColor: '#3498db',
        padding: 10,
        paddingBottom: 5,
        borderWidth: 0,
        flexDirection: 'row'
    },wrapper:{
        flexDirection: 'row'
    },
    backIcon:{
        marginTop: 7,
        marginRight: 13,
        color: "#FFF",
        marginLeft: 5,
        fontSize: 25
    },
    info:{
        flexDirection: 'column',
        marginLeft: 10,
    },  
    name:{
        color: '#FFF',
        fontSize: 17,
    },
    status:{
        color: '#FFF',
        fontSize: 14,
    },
})

export default HeaderChat;