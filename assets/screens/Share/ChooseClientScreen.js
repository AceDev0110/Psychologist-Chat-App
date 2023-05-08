import React, { Component, useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, FlatList, Dimensions, TouchableOpacity, TextInput, Image, StatusBar, Modal, Button, BackHandler, Alert } from 'react-native';
import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions, } from 'react-native/Libraries/NewAppScreen';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Toast from 'react-native-simple-toast';
import { Avatar, Accessory } from 'react-native-elements';
//+++++++++++++++   firebase    ++++++++++++++++
const usersRef = firestore().collection('users');
const psychologistRef = firestore().collection('psychologists');
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
//+++++++++++++++   Custom  ++++++++++++++++++++
import KTextInput from '../../components/KTextInput';
import KMainButton from '../../components/KMainButton';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const numColumns = 1;
function ChooseClientScreen({ navigation }) {
    const [clientsData, setClientsData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [chooseWhatString, setChooseWhatString] = useState("Choose user");
    var clientRef = usersRef;
    useEffect(() => {
        focusListener = navigation.addListener('focus', () => {
            console.log("Focused!!!!! ", global.iam);
            if (global.iam == "user") {
                clientRef = psychologistRef;
                setChooseWhatString("Choose psychologist");
            } else {
                clientRef = usersRef;
                setChooseWhatString("Choose user");
            }
            setClientsData([]);
            getclientsData();
        });

        return focusListener;
    }, [])



    const getclientsData = () => {
        setIsFetching(true);


        clientRef.get().then(async (querySnapshot) => {
            var tclients = [];

            if (querySnapshot.empty) {
                setCategoryData([]);
                setIsFetching(false);
            }

            querySnapshot.forEach(async (documentSnapshot) => {
                let cliName = documentSnapshot.data().username;
                let cliAvatar = documentSnapshot.data().avatar;
                let cliEmail = documentSnapshot.data().email;
                let cliCategory = documentSnapshot.data().category;
                const cliAvatarUrl = await storage().ref(cliAvatar).getDownloadURL();

                let msgID = global.myid + documentSnapshot.id;
                var unreadcount = 0;
                console.log(cliCategory);
                await firestore()
                    .collection('chatting')
                    .doc(msgID)
                    .collection('messages')
                    .where('sender', '==', documentSnapshot.id)
                    .where('read', '==', false)
                    .get()
                    .then(querySnapshot => {
                        console.log('Total users: ', querySnapshot.size);
                        unreadcount = querySnapshot.size;
                        //querySnapshot.forEach(documentSnapshot => { console.log('User ID: ', documentSnapshot.id, documentSnapshot.data()); });
                    });

                tclients[tclients.length] = {
                    id: documentSnapshot.id,
                    avatarurl: cliAvatarUrl,
                    email: cliEmail,
                    name: cliName,
                    category: cliCategory,
                    unreadcount: unreadcount
                }

                if (tclients.length == querySnapshot.size) {
                    tclients.sort((a, b) => b.unreadcount - a.unreadcount);
                    setClientsData(tclients);
                    console.log("Now setting clients data");
                    setIsFetching(false);
                }
            });
        });
    }

    const itemSelected = (item) => {
        global.clientid = item.id;
        navigation.navigate("xUserChatScreen");
    }

    const renderItem = ({ item, onPress }) => {
        let length = item.name.length;
        let fontsize = 24;
        if (length > 20) fontsize = 22;
        if (length > 25) fontsize = 20;

        return (
            <TouchableOpacity
                style={styles.renderItemStyle}
                onPress={() => itemSelected(item)}
            >
                <Avatar
                    rounded
                    size="large"
                    containerStyle={styles.avatarImageStyle}
                    source={{ uri: item.avatarurl }}
                />

                <Text style={[styles.renderItemTextStyle, { fontSize: fontsize }]}>{item.name}</Text>
                <Text style={styles.renderItemEmailStyle}>{item.email}</Text>
                
                {
                    global.iam == "psychologist" &&
                    (<Text style={styles.renderItemCategoryStyle}>{item.category}</Text>)
                }

                {
                    item.unreadcount > 0 && (
                        <View style={{
                            position: 'absolute',
                            top: 5,
                            left: 40,
                            backgroundColor: 'red',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            marginLeft: 20,
                            borderColor: 'red',
                            borderWidth: 2,
                            borderRadius: 40
                        }}>
                            <Text style={styles.SmallAlarmTextStyle}>{item.unreadcount}</Text>
                        </View>)
                }

            </TouchableOpacity>
        );
    }

    return (
        <LinearGradient colors={['#003366', '#004477']} style={styles.linearGradient}>
            <ScrollView style={styles.container}>
                <StatusBar hidden={true} />
                <View style={styles.HeaderStyle}>
                    <Text style={{ color: 'cyan', fontSize: 26 }}>{chooseWhatString}</Text>
                </View>

                <View style={styles.renderItemsContainer}>
                    {isFetching ?
                        (<Bubbles size={10} color="#00ffff" />) :
                        (<FlatList data={clientsData} renderItem={renderItem} numColumns={numColumns} keyExtractor={(item, index) => index.toString()} />)
                    }
                </View>
            </ScrollView>
        </LinearGradient>
    );
};
export default ChooseClientScreen;

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    renderItemsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '0%',
    },
    renderItemStyle: {
        marginTop: 10,
        borderWidth: 3,
        backgroundColor: '#00ffff33',
        borderColor: 'cyan',
        padding: 10,
        borderRadius: 200,
        marginTop: 14,
        width: screenWidth - 30,
        flexDirection: 'row'
    },
    HeaderStyle: {
        alignItems: 'center',
        padding: 10,
        borderColor: '#00ffff44',
        borderWidth: 2,
        borderTopWidth: 0,
        backgroundColor: '#003355',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        marginBottom: '10%'
    },
    renderItemTextStyle: {
        paddingLeft: 10,
        width: '65%',
        marginTop: -20,
        alignSelf: 'center',
        textAlign: 'center',
        color: 'white'
    },
    renderItemEmailStyle: {
        position: 'absolute',
        bottom: 0,
        paddingLeft: 10,
        paddingRight: 10,
        left: '20%',
        alignSelf: 'center',
        textAlign: 'left',
        color: '#004499',
        fontSize: 14,
        backgroundColor: 'cyan',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    renderItemCategoryStyle: {
        position: 'absolute',
        top: 0,
        paddingLeft: 10,
        paddingRight: 10,
        right: '10%',
        alignSelf: 'center',
        textAlign: 'left',
        color: '#004499',
        fontSize: 16,
        backgroundColor: 'cyan',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
    },
    titleText: {
        fontSize: 30,
        fontFamily: 'Rowdies-Light',
        textAlign: 'center',
        margin: 10,
        marginTop: 10,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        borderWidth: 1,
        borderColor: '#ffffff88',
        borderRadius: 30,
        color: 'white',
        backgroundColor: 'transparent',
    },
    SmallAlarmTextStyle: {
        fontSize: 20,
        width: 30,
        height: 30,
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    imageStyle: {
        width: 100,
        height: 100,
    },
    avatarImageStyle: {
        borderWidth: 3,
        borderColor: 'cyan'
    }
});
