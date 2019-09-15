import React, {Component, Fragment} from 'react'
import { StyleSheet, View } from 'react-native'
import { Thumbnail, Text, Icon } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

class UserProfile extends Component {
    constructor(props){
        super(props)
        this.state = {
            userId: null,
            userData : props.navigation.getParam('userData')
        }
    }

    componentDidMount = async () => {
        this.setState({
            userId: await AsyncStorage.getItem("uid")
        })
    }

    render(){
        const {userData, userId} = this.state
        return(
            <Fragment>
                <View style={styles.header}>
                    <Icon type="AntDesign" name="arrowleft" style={styles.backIcon} onPress={() => this.props.navigation.goBack()}/>
                    <Icon type="MaterialIcons" name="chat" style={styles.chatIcon} onPress={() => {this.props.navigation.navigate('ChatRoom', {receiverData: userData, userId: userId})}}/>
                </View>
                <View style={styles.container}>
                    <Thumbnail source={{uri:userData.image}} style={styles.photoUser} />
                    <Text style={styles.full_name}>{userData.full_name}</Text>
                </View>
                <View style={styles.info}>
                    <View style={styles.item}>
                        <Text style={styles.title}>Full Name</Text>
                        <Text style={styles.itemData}>{userData.full_name}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>Username</Text>
                        <Text style={styles.itemData}>{userData.username}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>Email</Text>
                        <Text style={styles.itemData}>{userData.email}</Text>
                    </View>
                </View>
            </Fragment>
        )
    }
}

export default UserProfile

const styles = StyleSheet.create({
    header: {
        position: 'relative',
        width: '100%',
        height: 60,
        backgroundColor: '#3498db',
        padding: 10,
        paddingBottom: 5,
        borderWidth: 0,
        flexDirection: 'row'
    },
    info:{
        paddingTop: 15,
        height: '100%',
        backgroundColor: '#F7F7F7',
        flexDirection: 'column'
    }, 
    item:{
        marginHorizontal: 20,
        marginTop: 10,
        backgroundColor: "#FFF",
        height: 60,
        borderRadius: 5,
        elevation: 1,
        flexDirection: 'column'
    },
    backIcon:{
        marginTop: 7,
        marginRight: 13,
        color: "#FFF",
        marginLeft: 5,
        fontSize: 25
    },
    container:{
        position: 'relative',
        justifyContent:'center',
        height: 200,
        backgroundColor: "#3498db"
    },
    photoUser:{
        position: 'absolute',
        top: 10,
        width: 140,
        height: 140,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#FFF',
        alignSelf: 'center'
    },
    full_name:{
        position: 'absolute',
        bottom: 15,
        color: "#FFF",
        fontSize: 20,
        alignSelf: 'center'
    },
    chatIcon:{
        position: 'absolute',
        color: "#FFF",
        right: 15,
        top: 17
    },
    title:{
        fontWeight: 'bold',
        fontSize: 13,
        paddingTop: 9,
        paddingLeft: 13
    },
    itemData: {
        fontSize: 17,
        paddingLeft: 15,
        fontWeight: '100',
        color: '#696969'
    }
})
