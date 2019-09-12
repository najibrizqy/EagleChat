import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from "react-native";
import { Container, Content, Form, Item, Input, Button, Toast, Row, Col, Icon, Spinner } from 'native-base';
import firebase, {Firestore} from '../../Config/Firebase';
import AsyncStorage from '@react-native-community/async-storage';

import logo from '../../Assets/eaglelogo.png'

class Signin extends Component {
  constructor(props){
    super(props)
    this.state = {
      formData: {
        email: '',
        password: ''
      },
      showToast: false,
      isLoading: false,
    }
  }

  unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate('HomeScreen')
      }
    });

  handleSignup = () => {
    this.unsubscribe()
    this.props.navigation.navigate('SignupScreen')
  }

  handleChange = (name, value) => {
    let newFormData = {...this.state.formData}
    newFormData[name] = value
    this.setState({
      formData: newFormData
    })
    console.log(newFormData)
  }

  handleSubmit = async () => {
    this.setState({isLoading:true})
    const {formData} = this.state
    await firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
    .then( async (res) => {
      AsyncStorage.setItem('uid', res.user.uid);
      await Firestore.collection("users").doc(res.user.uid).update({status: 'online'})
      .then( async () => {
        await Firestore.collection("users").doc(res.user.uid).get().then((result) => {
          AsyncStorage.setItem('email', result.data().email);
          AsyncStorage.setItem('full_name', result.data().full_name);
          AsyncStorage.setItem('image', result.data().image);
          AsyncStorage.setItem('username', result.data().username);

          this.props.navigation.navigate('HomeScreen')
        })
      })
    })
    .catch(err => {
      this.setState({isLoading:false})
      let errMsg = err.code == 'auth/invalid-email' ? 'Email not valid.': 'Email or password is wrong.';
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

  render() {
    return (
      <Container style={styles.container}>
        <Content showsVerticalScrollIndicator={false}>
            <View>
              <Image source={logo} style={styles.logo} />
            </View>
            <Form style={styles.formSignin}>
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
              <Row>
                <Col>
                  <Text style={styles.btnForgot}>Forgot Password</Text>
                </Col>
              </Row>
              {
                this.state.isLoading == false ?
                  <Button onPress={this.handleSubmit} full info style={styles.btnSignin}>
                    <Text style={styles.textSignin}>SIGN IN</Text>
                  </Button>
                : 
                  <Button onPress={this.handleSubmit} full info style={styles.btnSignin} disabled>
                    <Spinner color='white' style={styles.loading} /><Text style={styles.textSignin}>SIGN IN</Text>
                  </Button>
              }
            </Form>
            <Row>
              <Col>
                <Text style={styles.foot}>Don't have an account? &nbsp;
                  <Text style={styles.btnSignup} onPress={this.handleSignup}>Sign Up</Text>
                </Text>
              </Col>
            </Row>
        </Content>
      </Container>
    );
  }
  
  componentWillUnmount(){
    this.unsubscribe()
  }
}


export default Signin

let btnSignup = {
  color: '#4B4C72',
}

const styles = StyleSheet.create({
    container: {
      top: 40,
      marginLeft: 20,
      marginRight: 20,
    },
    formSignin: {
      marginTop: 10,
    },
    btnSignin: {
      marginTop: 30,
      borderRadius: 8,
      height: 50,
    },
    textSignin: {
      color:"white",
    },
    foot:{
      marginTop: 30,
      marginBottom: 50,
      alignSelf: 'center'
    },
    input:{
      marginTop: 15,
    },
    iconLabel: {
      color: 'gray'
    },
    btnSignup: {
      ...btnSignup,
      fontWeight: 'bold'
    },
    btnForgot: {
      ...btnSignup,
      textAlign: 'right',
      marginTop: 10,
      textDecorationLine: 'underline',
    },
    logo:{
      width: 150, 
      height:150,
      alignSelf: 'center'
    },
    toast: {
      margin: 20, 
      borderRadius: 10
    },
    loading: {
      marginLeft: -35,
      marginRight: 5
    }
});
