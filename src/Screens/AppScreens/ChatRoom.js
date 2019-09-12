import React, {Component, Fragment} from 'react';
import { StyleSheet, View, Text } from "react-native";
import { GiftedChat } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-community/async-storage'

import firebase, {Firestore} from '../../Config/Firebase';
import Header from '../../Components/HeaderChat';

class ChatRoom extends Component {
    constructor(props){
        super(props)
        let senderId =  props.navigation.getParam('userId');
        let receiverId =  props.navigation.getParam('receiverData').uid;

        let senderChatRef = Firestore.collection('messages').doc('chats')
                                .collection(senderId + receiverId)
        let receiverChatRef = Firestore.collection('messages').doc('chats')
                                .collection(receiverId + senderId)

        this.state = {
            messages: [],
            receiver: props.navigation.getParam('receiverData'),
            senderId,
            username: null,
            image : null,
            receiverChatRef,
            senderChatRef,
            unsubscribeTargetChat: receiverChatRef.onSnapshot(this.chatListener),
            unsubscribeOriginChat: senderChatRef.onSnapshot(this.chatListener),
        }
    }

    async componentDidMount(){
        this.setState({
            username: await AsyncStorage.getItem('username'),
            image: await AsyncStorage.getItem('image'),
        })
    }

    chatListener = (snapshot) => {
        let messages = snapshot.docChanges().map(changes => {
          let data = changes.doc.data()
          data.createdAt = new Date(data.createdAt.seconds * 1000)
          return data
        })
        let appendedMessage =  GiftedChat.append(this.state.messages, messages)
        appendedMessage.sort((a, b)=>b.createdAt.getTime() - a.createdAt.getTime())
        this.setState({messages:appendedMessage})
    }

    onSend(messages = []) {
        this.state.receiverChatRef.doc(messages[0]._id).set(messages[0])
    }

    componentWillUnmount(){
        this.state.unsubscribeOriginChat()
        this.state.unsubscribeTargetChat()
    }

    render(){
        return(
            <Fragment>
                <Header receiverData={this.state.receiver} navigation={this.props.navigation} />
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    onPressAvatar={this.openFriendProfile}
                    user={{
                        _id: this.state.senderId,
                        name: this.state.username,
                        avatar: this.state.image
                    }}
                />
            </Fragment>
        )
    }
}

export default ChatRoom