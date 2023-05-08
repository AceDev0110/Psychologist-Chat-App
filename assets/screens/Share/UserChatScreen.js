import React, { Component, useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Header, FlatList, Dimensions, TouchableOpacity, TextInput, Image, StatusBar, Modal, Button, BackHandler, Alert } from 'react-native';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Toast from 'react-native-simple-toast';
//+++++++++++++++ firebase +++++++++++++
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
//+++++++++++++++   Custom  ++++++++++++++++++++
import KTextInput from '../../components/KTextInput';
import KMainButton from '../../components/KMainButton';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
function UserChatScreen({ navigation }) {
    const [chatData, setChatData] = useState([]);
    const [currentChat, setCurrentChat] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    const [myData, setMyData] = useState();
    const [clientData, setClientData] = useState({ name: '' });

    const [myref, setMyRef] = useState();
    const [clientref, setClientRef] = useState();

    var mychatid = "";
    var clientchatid = "";
    
    useEffect(() => {
        focusListener = navigation.addListener('focus', () => {
            setChatData([]);
            setClientData({ name: '' });
        });
        //setIsFetching(true);

        mychatid = global.myid + global.clientid;
        clientchatid = global.clientid + global.myid;

        console.log("=====================================================================");
        console.log("iam = ", global.iam);
        console.log("mycategory = ", global.mycategory);
        console.log("myid = ", global.myid);
        console.log("clientid = ", global.clientid);

        console.log("mychatid = ", mychatid);
        console.log("clientchatid = ", clientchatid);

        setMyRef(firestore().collection('chatting').doc(mychatid).collection('messages'));
        setClientRef(firestore().collection('chatting').doc(clientchatid).collection('messages'));

        setMyData({
            avatarurl: "https://image.freepik.com/free-vector/businessman-character-avatar-icon-vector-illustration-design_24877-18271.jpg",
            name: ""
        });

        setClientData({
            avatarurl: "https://image.freepik.com/free-vector/businessman-character-avatar-icon-vector-illustration-design_24877-18271.jpg",
            name: ""
        });


        if (global.iam == "user") {
            firestore().collection('users').doc(global.myid).get().then(async (documentSnapShot) => {
                const url = await storage().ref(documentSnapShot.data().avatar).getDownloadURL();
                setMyData({ avatarurl: url, name: documentSnapShot.data().username })
            });
            firestore().collection('psychologists').doc(global.clientid).get().then(async (documentSnapShot) => {
                const url = await storage().ref(documentSnapShot.data().avatar).getDownloadURL();
                setClientData({ avatarurl: url, name: documentSnapShot.data().username })
            });
        } else {
            firestore().collection('psychologists').doc(global.myid).get().then(async (documentSnapShot) => {
                const url = await storage().ref(documentSnapShot.data().avatar).getDownloadURL();
                setMyData({ avatarurl: url, name: documentSnapShot.data().username })
            });
            firestore().collection('users').doc(global.clientid).get().then(async (documentSnapShot) => {
                const url = await storage().ref(documentSnapShot.data().avatar).getDownloadURL();
                setClientData({ avatarurl: url, name: documentSnapShot.data().username })
            });
        }

        let myMsgRef = firestore().collection('chatting').doc(mychatid).collection('messages');
        return myMsgRef.onSnapshot(querySnapshot => {
            const msglist = [];
            querySnapshot.forEach(doc => {
                let id = doc.id;
                let fsender = doc.data().sender;
                let fchat = doc.data().chat;
                let ftimestamp = doc.data().timestamp;
                let fread = doc.data().read;
                //console.log(id, fsender, fchat, ftimestamp);
                msglist[msglist.length] = {
                    sender: fsender,
                    chat: fchat,
                    timestamp: ftimestamp
                }
                if (!fread)
                    myMsgRef.doc(doc.id).update({ read: true }).then(() => { console.log('set as read!'); });
            });
            msglist.sort((a, b) => a.timestamp - b.timestamp);
            setChatData(msglist);
        });


    }, [])


    const renderItem = ({ item, onPress }) => {
        var flexDirectionStyle = 'row';
        var textboxColor = '#ffffff44';
        var moreStyle = { borderTopLeftRadius: 0 };
        var avatarurl = clientData.avatarurl;

        if (item.sender == global.myid)
            flexDirectionStyle = 'row-reverse';
        if (item.sender == global.myid)
            textboxColor = '#00AAEE88';
        if (item.sender == global.myid)
            moreStyle = { borderTopRightRadius: 0 };
        if (item.sender == global.myid)
            avatarurl = myData.avatarurl;

        return (
            <View style={[styles.renderItemStyle, { flexDirection: flexDirectionStyle }]}>

                <Image
                    source={{ uri: avatarurl }}
                    style={styles.imageStyle}
                    borderRadius={2000}
                />
                <Text style={[styles.renderItemTextStyle, { fontSize: 20, backgroundColor: textboxColor }, moreStyle]}>{item.chat}</Text>
            </View>
        );
    }

    const onSEND = () => {
        myref.add({
            chat: currentChat,
            sender: myid,
            read: true,
            timestamp: chatData.length
        }).then(() => {
            console.log('chat added to my ref');
            setCurrentChat("");
        });

        clientref.add({
            chat: currentChat,
            sender: myid,
            read: false,
            timestamp: chatData.length
        }).then(() => {
            console.log('chat added to client ref');
        })
    }


    return (
        <LinearGradient colors={['#002244', '#004477']} style={styles.linearGradient}>
            <LinearGradient colors={['#005577', '#002744']} style={styles.HeaderStyle}>
                <Text style={{ color: '#00ffff', fontSize: 26 }}>Chat with {clientData.name}</Text>
            </LinearGradient>

            <ScrollView style={styles.container}>
                <StatusBar hidden={true} />
                {/* <View style = {{height: '20%'}}></View>           */}

                <View style={styles.renderItemsContainer}>
                    {isFetching ?
                        (<Bubbles size={10} color="#004499" />) :
                        (<FlatList data={chatData} renderItem={renderItem} numColumns={1} keyExtractor={(item, index) => index.toString()} />)
                    }
                </View>
            </ScrollView>
            <View style={styles.FooterStyle}>
                {/* <Text style={{ color: 'cyan', fontSize: 26 }}>Chat with {clientData.name}</Text> */}
                <TextInput style={styles.SendTextInput} onChangeText={(value) => setCurrentChat(value)} value={currentChat} />
                <TouchableOpacity
                    onPress={onSEND}
                    style={styles.sendButtonStlye}
                >
                    <Text style={styles.sendButtonTextStyle}>SEND</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};
export default UserChatScreen;

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    linearGradient: {
        flex: 1,
    },
    HeaderStyle: {
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 0,
    },
    FooterStyle: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 0,
        borderTopWidth: 2,
        borderColor: 'cyan',
        padding: 10,
        backgroundColor: '#003355'
    },
    renderItemsContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    renderItemStyle: {
        margin: 0,
        padding: 2,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    renderItemTextStyle: {
        backgroundColor: '#ffffff55',
        borderRadius: 13,
        padding: 5,
        paddingLeft: 20,
        paddingRight: 20,
        textAlignVertical: 'center',
        color: 'white',
        maxWidth: '60%'
    },
    imageStyle: {
        width: 50,
        height: 50,
        marginLeft: 10,
        marginRight: 10
    },
    SendTextInput: {
        backgroundColor: 'white',
        width: screenWidth - 100,
        borderRadius: 0,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        paddingLeft: 10,
        paddingRight: 10,
        height: 50,
        fontSize: 18
    },
    sendButtonStlye: {
        width: 70,
        height: 50,
        borderRadius: 0,
        borderTopRightRadius: 14,
        borderBottomRightRadius: 14,
        marginLeft: 3,
        backgroundColor: 'cyan',
        justifyContent: 'center'
    },
    sendButtonTextStyle: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
        fontSize: 18
    }
});
