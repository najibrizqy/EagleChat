import React, {Component, Fragment} from 'react';
import {StyleSheet, View} from 'react-native';
import {GiftedChat, Send} from 'react-native-gifted-chat';
import {Icon} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

import firebase, {Firestore} from '../../Config/Firebase';
import Header from '../../Components/HeaderChat';

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    let senderId = props.navigation.getParam('userId');
    let receiverId = props.navigation.getParam('receiverData').uid;

    let senderChatRef = Firestore.collection('messages')
      .doc('chats')
      .collection(senderId + receiverId);
    let receiverChatRef = Firestore.collection('messages')
      .doc('chats')
      .collection(receiverId + senderId);

    this.state = {
      messages: [],
      receiver: props.navigation.getParam('receiverData'),
      senderId,
      username: null,
      image: null,
      receiverChatRef,
      senderChatRef,
      unsubscribeTargetChat: receiverChatRef.onSnapshot(this.chatListener),
      unsubscribeOriginChat: senderChatRef.onSnapshot(this.chatListener),
    };
  }

  async componentDidMount() {
    this.setState({
      username: await AsyncStorage.getItem('username'),
      image: await AsyncStorage.getItem('image'),
    });
  }

  chatListener = (snapshot) => {
    let docChanges = snapshot.docChanges();
    let messages = [];
    docChanges.forEach((changes) => {
      let data = changes.doc.data();
      if (data.createdAt !== null) {
        data.createdAt = new Date(data.createdAt.seconds * 1000);
        messages.push(data);
      }
    });
    let appendedMessage = GiftedChat.append(this.state.messages, messages);
    appendedMessage.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    this.setState({messages: appendedMessage});
  };

  onSend(messages = []) {
    messages[0].createdAt = firebase.firestore.FieldValue.serverTimestamp();
    this.state.receiverChatRef.doc(messages[0]._id).set(messages[0]);
  }

  componentWillUnmount() {
    this.state.unsubscribeOriginChat();
    this.state.unsubscribeTargetChat();
  }

    render(){
        return(
            <Fragment>
                <Header receiverData={this.state.receiver} navigation={this.props.navigation} />
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    onPressAvatar={() => this.props.navigation.navigate('UserProfile', {userData: this.state.receiver})}
                    renderSend ={ (props) => {
                        return (
                            <Send
                                {...props}
                            >
                                <View style={styles.send}>
                                    <Icon type="MaterialIcons" name="send" style={{color:"#3498da"}} />
                                </View>
                            </Send>
                        );
                    }}
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

const styles = StyleSheet.create({
  send: {
    marginRight: 10,
    marginBottom: 7,
  },
});

export default ChatRoom;
