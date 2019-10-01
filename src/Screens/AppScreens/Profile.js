import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, PermissionsAndroid } from "react-native"
import { Container, Button, Text, Content, Thumbnail, Form, Label, Input, Item, Spinner, Toast, Icon } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'react-native-fetch-blob'

import firebase, {Firestore} from '../../Config/Firebase'

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
            isLoading: false,
            uploadingImage: false
        }
    }
    
    handleLogout = async () => {
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

    requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ])
            return granted === PermissionsAndroid.RESULTS.GRANTED
        } catch (err) {
            console.log(err);
            return false
        }
    }

    editImage = async () => {
        const Blob = RNFetchBlob.polyfill.Blob
        const fs = RNFetchBlob.fs
        window.Blob = Blob
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest

        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            mediaType: 'photo'
        }

        let cameraPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA) && PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE) && PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
        if(!cameraPermission){
            cameraPermission = await this.requestCameraPermission()
        } else {
            ImagePicker.showImagePicker(options, (response)=> {
                this.setState({uploadingImage:true})
                let uploadBob = null
                const imageRef = firebase.storage().ref('Images').child('ProfileImages/' + this.state.uid)
                fs.readFile(response.path, 'base64')
                    .then( (data) => {
                        return Blob.build(data, { type: `${response.mime};BASE64`} )
                    })
                    .then( (blob) => {
                        uploadBob = blob
                        return imageRef.put(blob, { contentType: response.mime})
                    })
                    .then( () => {
                        uploadBob.close()
                        return imageRef.getDownloadURL()
                    })
                    .then( (url) => {
                        this.setState({
                            formData:{
                              ...this.state.formData,
                              image: url
                            },
                            uploadingImage:false,
                        })
                        Toast.show({
                            text: `Press save button to update profil`,
                            buttonText: "Ok",
                            position:'bottom',
                            duration: 3000,
                            style: styles.toast
                        })
                    })
                    .catch( err => {
                        console.log(err)
                    })
            })
        }
        
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
                Toast.show({
                    text:' failed to save profile '+ err.message,
                    position: 'bottom',
                    type: 'danger',
                    duration: 4000,
                    style: styles.toast
                })
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
        const {formData, isLoading, uploadingImage} = this.state
        return(
            <Container>
                <View style={styles.img}>
                    {
                        uploadingImage ? 
                            <Spinner color="#3498db" />
                        :
                            <>
                                <TouchableOpacity activeOpacity={0.9} style={styles.cameraWrapper} onPress={() => this.editImage()}>
                                    <Icon type="Entypo" name="camera" style={styles.cameraIcon}/>
                                </TouchableOpacity>
                                <Thumbnail  source={{uri: formData.image}} style={styles.imageProfile} />
                            </>
                    }                    
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
                        <Button iconLeft danger onPress={this.handleLogout}>
                            <Icon type="AntDesign" name="logout" style={styles.iconSignout}/>
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
        position: 'relative',
        marginTop: 20,
        alignSelf: 'center',
        zIndex: 1
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
    cameraWrapper:{
        position: 'absolute',
        backgroundColor: '#3498db',
        borderRadius: 30,
        zIndex: 2,
        bottom: 2,
        right: 4
    },
    cameraIcon:{
        fontSize: 17,
        padding: 7,
        color: '#FFF'
    },
    btnSave:{
        alignItems: 'flex-start',
        width: 100,
        marginRight: 20
    },
    bdBottom:{
        borderBottomWidth:0
    },
    buttonWrap: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20
    },
    textBtnSave:{
        paddingLeft: 28,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    textBtnSignout:{
        paddingLeft: 10,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    iconSignout:{
        fontSize: 20,
        alignSelf:'center',
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