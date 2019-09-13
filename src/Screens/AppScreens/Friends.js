import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { FlatList } from 'react-native-gesture-handler'
import { Container, Content, List, ListItem, Left, Body, Thumbnail, Text, Icon, Spinner } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {Firestore} from '../../Config/Firebase';

export default class FriendList extends Component{
    constructor() {
        super()
        this.state = {
          userId: null,
          users:[],
        }
    }

    componentDidMount= async () => {
        const userId = await AsyncStorage.getItem('uid')
        this.setState({ userId }, () => {
            Firestore.collection('users').onSnapshot(snapshot => {
                let users = snapshot.docs.map(
                    doc => {
                        let data = doc.data()
                        data.uid = doc.id
                        return data.uid !== this.state.userId ? data : null
                    })
                this.setState({users})
            })
        });
    }

    renderFriends = ({item}) => {
        if(item)
        return (
            <List>
                <ListItem avatar>
                    <Left>
                        <Thumbnail source={{ uri: `${item.image}` }} />
                    </Left>
                    <Body>
                        <TouchableOpacity activeOpacity={1} onPress={() => {this.props.navigation.navigate('ChatRoom', {receiverData: item, userId: this.state.userId})}}>
                            <Text>{item.username}</Text>
                            <View style={styles.statusWrap}>
                                <Icon type="Octicons" name="primitive-dot" style={item.status == "online" ? styles.online : styles.offline} />
                                <Text note>{item.status}</Text>
                            </View>
                        </TouchableOpacity>
                    </Body>
                </ListItem>
            </List>
        )
    }

    render(){
        const img = 'https://www.shareicon.net/data/2016/09/01/822711_user_512x512.png';
        return(
            <Container>
                <Content>
                    {
                        this.state.users.length > 0 ? 
                            <FlatList
                                data={this.state.users}
                                keyExtractor = {(item) => item != null ? item.username:item}
                                renderItem = {this.renderFriends}
                            />
                        : 
                        <View style={styles.loading}>
                            <Spinner color="#3498db" />
                        </View>
                    }
                </Content>
            </Container>
        )
    }
}

const status ={
    fontSize: 18,
    marginRight: 3,
    marginTop: 2
}

const styles = StyleSheet.create({
    statusWrap:{
        flexDirection: 'row'
    },
    online: {
        ...status,
        color: '#42b72a',
    },
    offline:{
        ...status,
        color: 'gray'
    },
    loading:{
        alignSelf: 'center',
    }
});