import React, {Component, useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';

import {  SafeAreaView,  StyleSheet,  ScrollView,  View,  Text,  TextInput,  Image,  StatusBar, Modal,  Button, BackHandler, Alert} from 'react-native';
import {  Header,  LearnMoreLinks,  Colors,  DebugInstructions,  ReloadInstructions,} from 'react-native/Libraries/NewAppScreen';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import Toast from 'react-native-simple-toast';
import auth from '@react-native-firebase/auth';
//--------------------  Custom  ---------------------------
import KTextInput from '../../components/KTextInput';
import KMainButton from '../../components/KMainButton';
import { registerVersion } from 'firebase';

// import auth from '@react-native-firebase/auth';
function UserForgotPassword({navigation}){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onForgotPassword = () => {
    console.log(email);
    if(email == ""){
      Toast.show('Please input email');
    }else{
      auth().sendPasswordResetEmail(email)
      .then(function (user) {
        alert('Please check your email...');
        navigation.pop();
      }).catch(function (e) {
        console.log(e)
      })
    }
  }

  return ( 
    <LinearGradient colors={['#001144', '#001144']} style={styles.linearGradient}>
      <ScrollView style={styles.container}>
        <StatusBar hidden={true} />  
        {/* <View style = {{height: '20%'}}></View>           */}

        <View style = {{alignItems : 'center', marginTop: '50%'}}  >
          <Text style = {styles.titleText}> RESET PASSWORD </Text>
        </View>

        <View style = {{flexDirection : 'column', justifyContent: 'center', marginTop: 20,  width : '80%', alignSelf: 'center', marginTop : '10%'}}>
          <KTextInput placeholder = "Email"  onChangeText = {email => setEmail(email)} />
          <KMainButton title = "SEND" callback = {onForgotPassword}/>
        </View>

        <View></View>
      </ScrollView>
    </LinearGradient>
  );
};
export default UserForgotPassword;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  titleText: {
    fontSize: 40,
    fontFamily: 'Rowdies-Light',
    textAlign: 'center',
    margin: 10,
    color: 'cyan',
    backgroundColor: 'transparent',
  },
});
