import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Container, Content, Form, Item, Input, Button, Toast, Row, Col, Icon } from 'native-base';
import firebase, {Firestore}  from '../../Config/Firebase';

import logo from '../../Assets/eaglelogo.png'

class Signup extends Component {
  constructor(props){
    super(props)
    this.state = {
      formData: {
        username: '',
        full_name: '',
        email: '',
        password: ''
      },
      showToast: false,
      isLoading: false,
    }
  }

  handleChange = (name, value) => {
    let newFormData = {...this.state.formData}
    newFormData[name] = value
    this.setState({
      formData: newFormData
    })
    console.log(newFormData)
  }

  handleSubmit = () => {
    const {formData} = this.state
    if(formData.username == '' || formData.full_name == '' ){
      let errMsg = ''
      if(formData.username.length < 6 ){
        errMsg = 'The Username must be 6 characters long or more';
      }else if(formData.full_name.length < 6 ){
        errMsg = 'The Full Name must be 6 characters long or more';
      }
      Toast.show({
        text: errMsg,
        buttonText: 'Ok',
        type: "danger",
        position:'bottom',
        duration:3000,
        style: styles.toast
      })
    }else{
      firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password)
      .then((user) => {
        const userID = user.user.uid
        const userRef = Firestore.collection('users').doc(userID)
        userRef.set({
          full_name: formData.full_name,
          image: 'https://www.shareicon.net/data/2016/09/01/822711_user_512x512.png',
          status: 'offline',
          username: formData.username,
        })
        Toast.show({
          text: `Welcome ${formData.username}`,
          buttonText: "Ok",
          type: "success",
          position:'bottom',
          duration:3000,
          style: styles.toast
        })
        this.props.navigation.navigate('HomeScreen')
      })
      .catch(err => {
        let errMsg = err.code == 'auth/invalid-email' ? 'Email not valid.': err.message;
        Toast.show({
          text: errMsg,
          buttonText: 'Ok',
          type: "danger",
          position:'bottom',
          duration:3000,
          style: styles.toast
        })
        console.log(err)
      })
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content style={styles.content} showsVerticalScrollIndicator={false}>
            <View>
              <Image source={logo} style={styles.logo} />
            </View>
            <Form style={styles.form}>
                <Item rounded style={styles.input}>
                  <Icon type="MaterialIcons" name="person" style={styles.iconLabel} />
                  <Input
                    maxLength={15} 
                    placeholder="Username" 
                    onChangeText={(text)=>this.handleChange('username',text)}/>
                </Item>
                <Item rounded style={styles.input}>
                  <Icon type="MaterialIcons" name="person-outline" style={styles.iconLabel} />
                  <Input 
                    maxLength={30} 
                    placeholder="Full Name" 
                    onChangeText={(text)=>this.handleChange('full_name',text)} />
                </Item>
                <Item rounded style={styles.input}>
                  <Icon type="MaterialIcons" name="email" style={styles.iconLabel} />
                  <Input 
                    keyboardType='email-address' 
                    placeholder="Email" 
                    autoCompleteType='email' 
                    onChangeText={(text)=>this.handleChange('email',text)} />
                </Item>
                <Item rounded style={styles.input}>
                  <Icon type="MaterialIcons" name="lock" style={styles.iconLabel} />
                  <Input 
                    secureTextEntry={true} 
                    placeholder="Password" 
                    maxLength={16} 
                    onChangeText={(text)=>this.handleChange('password',text)} />
                </Item>
                <Button full info style={styles.btnSignup} onPress={this.handleSubmit}>
                  <Text style={styles.textSignup}>SIGN UP</Text>
                </Button>
            </Form>
            <Row style={styles.foot}>
              <Col>
                <TouchableOpacity activeOpacity={.9} style={styles.backWrap} onPress={() => {this.props.navigation.navigate('SigninScreen')}}>
                  <Icon type="FontAwesome" name="arrow-left" style={styles.backIcon}/>
                  <Text style={styles.textSignin}>Sign In</Text>  
                </TouchableOpacity>
              </Col>
            </Row>
        </Content>
      </Container>
    );
  }
}

export default Signup

const styles = StyleSheet.create({
    container: {
      marginTop: 40,
      marginRight: 20,
    },
    content:{
      marginLeft: 20,
    },
    form:{
      marginTop: 15,
    },
    btnSignup: {
      marginTop: 30,
      borderRadius: 8,
      height: 50,
    },
    textSignin: {
      color:"gray",
    },
    textSignup: {
      color:"#FFF",
    },
    foot:{
      marginTop: 40,
      marginBottom: 10,
    },
    input:{
      marginTop: 15,
    },
    iconLabel: {
      color: 'gray'
    },
    toast: {
      margin: 20, 
      borderRadius: 10
    },
    backWrap:{
      flexDirection: 'row',
    },
    backIcon:{
      color:'gray',fontSize:15, marginRight: 10
    },
    logo:{
      width: 150, 
      height:150,
      alignSelf: 'center'
    }
});
