import React, { Component, useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, FlatList, Dimensions, TouchableOpacity, TextInput, Image, StatusBar, Modal, Button, BackHandler, Alert } from 'react-native';
import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions, } from 'react-native/Libraries/NewAppScreen';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Toast from 'react-native-simple-toast';
//+++++++++++++++   Firebase   +++++++++++++++++
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
//+++++++++++++++   Custom  ++++++++++++++++++++
import KTextInput from '../../components/KTextInput';
import KMainButton from '../../components/KMainButton';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const numColumns = 2;
function ChooseCategoryScreen({ navigation }) {
    const [categoryData, setCategoryData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        //setIsFetching(true);
        setCategoryData([
            {
                imageurl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
                categoryname: "LOVE"
            },
            {
                imageurl: "https://images.unsplash.com/photo-1522098605161-cc0c1434c31a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
                categoryname: "FRIENDS"
            },
            {
                imageurl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
                categoryname: "MONEY"
            },
            {
                imageurl: "https://images.unsplash.com/photo-1507537362848-9c7e70b7b5c1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
                categoryname: "ADVICE"
            },
            {
                imageurl: "https://images.unsplash.com/photo-1588979355313-6711a095465f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=321&q=80",
                categoryname: "FAMILY"
            },
            {
                imageurl: "https://images.unsplash.com/photo-1511299348232-b8edbd59e363?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=358&q=80",
                categoryname: "EVERYTHING"
            },
        ])
    }, [])

    const itemSelected = (item) => {
        console.log(item);
        global.mycategory = item.categoryname;
        firestore().collection('users').doc(myid).update({ category : item.categoryname }).then(() => { console.log('category set!'); });
        navigation.navigate("xChooseClientScreen");
    }

    const renderItem = ({ item, onPress }) => {
        let length = item.categoryname.length;
        let fontsize = 20;
        if (length > 20) fontsize = 12;
        if (length > 25) fontsize = 10;

        return (
            <View style={styles.renderItemStyle}>
                <TouchableOpacity
                    style={styles.renderImageCoverStyle}
                    onPress={() => itemSelected(item)}
                >
                    <Image
                        source={{ uri: item.imageurl }}
                        style={styles.imageStyle}
                        resizeMode="stretch"
                    />
                </TouchableOpacity>
                <Text style={[styles.itemTextStyle, { fontSize: fontsize }]}>{item.categoryname}</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#003366', '#004477']} style={styles.linearGradient}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <StatusBar hidden={true} />
                <View style={styles.HeaderStyle}>
                    <Text style={{ color: 'cyan', fontSize: 26 }}>Choose category</Text>
                </View>



                <View style={styles.container}>
                    {isFetching ?
                        (<Bubbles size={10} color="#004499" />) :
                        (<FlatList data={categoryData} renderItem={renderItem} numColumns={numColumns} keyExtractor={(item, index) => index.toString()} />)
                    }
                </View>
                {/* 
                <View style={{ flexDirection: 'column', justifyContent: 'center', marginTop: 0, width: '80%', alignSelf: 'center', marginBottom: '10%' }}>
                    <KMainButton title="NEXT" callback={onNext} />
                </View> */}

                <View></View>
            </ScrollView>
        </LinearGradient>
    );
};
export default ChooseCategoryScreen;

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
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
        marginTop: 30,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        borderWidth: 1,
        borderColor: '#ffffff88',
        borderRadius: 30,
        color: 'white',
        backgroundColor: 'transparent',
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
        marginBottom : '10%',
    },
    renderItemStyle: {
        width: screenWidth * 0.4,
        height: screenWidth * 0.4,
        margin: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'cyan',
        borderBottomLeftRadius : 20,
        borderBottomRightRadius : 20
    },
    renderImageCoverStyle: {
        width: '100%',
        height: '75%',
        alignItems: 'center',
        display: 'flex'
    },
    itemTextStyle: {
        //position : 'absolute', 
        //bottom : 0,
        marginTop: 0,
        width: '100%',
        height: '25%',
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: '#00ffff22',
        color: 'cyan',
        fontSize: 14,
        fontWeight: 'bold',
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderTopColor: 'white',
        borderTopWidth: 1
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        //borderWidth : 2,
        //borderColor : '#003388'
    },
});
