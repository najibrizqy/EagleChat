import React, { Component } from 'react';
import { StyleSheet, View, TextInput } from "react-native";
import { Container, Button, Text, Content, Thumbnail, Form, Label, Input, Item, Spinner, Toast } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

import firebase, {Firestore} from '../../Config/Firebase';

export default class Profile extends Component{
    constructor(props){
        super(props)
        this.state= {
            uid: null,
            formData: {
                email: null,
                full_name: null,
                username: null,
                image: null
            },
            isLoading: false
        }
    }
    
    handleLogout = async () => {
        await AsyncStorage.clear();
        await firebase.auth().signOut()
        .then( async () => {
            const userToken = await AsyncStorage.getItem('uid');
            await Firestore.collection("users").doc(userToken).update({status: 'offline'})
            this.props.navigation.navigate('SigninScreen')
        })
        .catch(err =>{
            console.log(err)
        })
    }

    handleChange = (name, value) => {
        let newFormData = {...this.state.formData}
        newFormData[name] = value
        this.setState({
          formData: newFormData
        })
    }

    handleSave = async () => {
        this.setState({isLoading:true})
        const {formData, uid} = this.state
        await Firestore.collection("users").doc(uid).update(formData)
            .then( async () => {
                await AsyncStorage.setItem("email", formData.email);
                await AsyncStorage.setItem("full_name", formData.full_name);
                await AsyncStorage.setItem("username", formData.username);
                await AsyncStorage.setItem("image", formData.image);
                this.setState({isLoading:false})
                Toast.show({
                    text: `Succesful Update Profil`,
                    buttonText: "Ok",
                    type: "success",
                    position:'bottom',
                    duration:4000,
                    style: styles.toast
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    componentDidMount = async () => {
        const email = await AsyncStorage.getItem("email");
        const full_name = await AsyncStorage.getItem("full_name");
        const username = await AsyncStorage.getItem("username");
        const image = await AsyncStorage.getItem("image");
        const data = {
            email,
            full_name,
            username,
            image
        }
        this.setState({
            uid: await AsyncStorage.getItem("uid"),
            formData : data
        }, () => {console.log(this.state)})
    }

    render(){
        const {formData, isLoading} = this.state
        return(
            <Container>
                <View style={styles.img}>
                    <Thumbnail  source={{uri: formData.image}} style={styles.imageProfile} />
                </View>
                <Content style={styles.content} >
                    <Form>
                        <Item stackedLabel style={styles.bdBottom}>
                            <Label>Full Name</Label>
                            <Input 
                            defaultValue={formData.full_name} 
                            placeholder="Input Full Name" 
                            underlineColorAndroid="#3498db"
                            onChangeText={(text)=>this.handleChange('full_name',text)}/>
                        </Item>
                        <Item stackedLabel style={styles.bdBottom}>
                            <Label>Username</Label>
                            <Input 
                            defaultValue={formData.username}
                             placeholder="Input Username"
                             underlineColorAndroid="#3498db"
                             onChangeText={(text)=>this.handleChange('username',text)}/>
                        </Item>
                        <Item stackedLabel style={styles.bdBottom}>
                            <Label>Email</Label>
                            <Input 
                            defaultValue={formData.email} 
                            disabled 
                            underlineColorAndroid="#3498db"/>
                        </Item>
                        <Item stackedLabel style={styles.bdBottom}>
                            <Label>Image</Label>
                            <Input 
                            defaultValue={formData.image} 
                            placeholder="Input Image URL" 
                            underlineColorAndroid="#3498db"
                            onChangeText={(text)=>this.handleChange('image',text)}/>
                        </Item>
                    </Form>
                    <View style={styles.buttonWrap}>
                        {
                            isLoading ? 
                                <Button info style={styles.btnSave} onPress={this.handleSave} disabled>
                                    <Spinner color='white' style={styles.loading} /><Text style={styles.textBtnLoading}> SAVE </Text>
                                </Button>
                            :
                                <Button info style={styles.btnSave} onPress={this.handleSave}>
                                    <Text style={styles.textBtnSave}> SAVE </Text>
                                </Button>
                        }
                        <Button danger style={styles.btnLogout} onPress={this.handleLogout}>
                            <Text style={styles.textBtnSignout}> LOGOUT </Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    img:{
        marginTop: 20,
        alignItems: 'center'
    },
    content:{
        marginTop: 20,
        marginLeft: 5,
        marginRight: 20,
    },
    imageProfile:{
        width: 120,
        height: 120,
        borderWidth: 5,
        borderColor: "#3498db",
        borderRadius: 100
    },
    btnSave:{
        alignItems: 'flex-start',
        width: 100,
        marginRight: 20
    },
    btnLogout:{
        alignItems: 'flex-end',
        width: 100
    },
    bdBottom:{
        borderBottomWidth:0
    },
    buttonWrap: {
        marginTop: 20,
        flexDirection: 'row',
        marginLeft: 20
    },
    textBtnSave:{
        paddingLeft: 28,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    textBtnSignout:{
        paddingLeft: 20,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    loading:{
        marginTop: -23,
        marginLeft: 5,
        padding: 0
    },
    textBtnLoading:{
        marginTop: 7,
        marginLeft: -20,
        paddingLeft: 0
    },
    toast: {
        margin: 20, 
        borderRadius: 10
    },
});