import React, {Component, useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';

import {  SafeAreaView,  StyleSheet,  ScrollView,  View,  Text,  TextInput,  Image,  StatusBar, Modal,  Button, BackHandler, Alert} from 'react-native';
import {  Header,  LearnMoreLinks,  Colors,  DebugInstructions,  ReloadInstructions,} from 'react-native/Libraries/NewAppScreen';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import Toast from 'react-native-simple-toast';
import auth from '@react-native-firebase/auth';
import AwesomeAlert from 'react-native-awesome-alerts';
//++++++++++++++  Firebase +++++++++
import firestore from '@react-native-firebase/firestore';
const psychologistCol = firestore().collection('psychologists');
//--------------------  Custom  ---------------------------
import KTextInput from '../../components/KTextInput';
import KMainButton from '../../components/KMainButton';
import { registerVersion } from 'firebase';

// import auth from '@react-native-firebase/auth';
function PsychologistLogin({navigation}){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);

  const onSignIn = () => {
    console.log(email);
    console.log(password);
    if(email == ""){
      Toast.showWithGravity('Please input email', Toast.SHORT, Toast.TOP);
    }else if(password == ""){
      Toast.showWithGravity('Please input password', Toast.SHORT, Toast.TOP);
    }else{
      setUploading(true);
      auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setUploading(false);
        psychologistCol.where('email', '==', email).get().then(async (querySnapshot) => {
          querySnapshot.forEach(async (documentSnapshot) => {
            global.myid = documentSnapshot.id;
            global.iam = "psychologist";
            console.log("psychologist logging in", global.iam);
            navigation.navigate('xChooseClientScreen');
          });
        });
      })
      .catch(error => {
        Toast.show(error.code);
        Toast.showWithGravity(error.code, Toast.SHORT, Toast.TOP);
        setUploading(false);
      });
    }
  }

  return ( 
    <LinearGradient colors={['#001144', '#001144']} style={styles.linearGradient}>
      <ScrollView style={styles.container}>
        <StatusBar hidden={true} />  
        {/* <View style = {{height: '20%'}}></View>           */}

        <View style = {{alignItems : 'center', marginTop: '10%'}}  >
          <Image source={require('../../images/AlwaysHereForYou.png')} style = {{width: 250, height: 200}} />
        </View>

        <View style = {{flexDirection : 'column', justifyContent: 'center', marginTop: 20,  width : '80%', alignSelf: 'center', marginTop : '10%'}}>
          <KTextInput placeholder = "Email"  onChangeText = {email => setEmail(email)} />
          <KTextInput placeholder = "Password" onChangeText = {password => setPassword(password)} password />

          <KMainButton title = "     LOGIN     " callback = {onSignIn}/>
          <KMainButton title = "     FORGOT PASSWORD     " callback = {() => navigation.navigate("xPsychologistForgotPassword")} onlylabel/>
          <KMainButton title = "     REGISTER     " callback = {() => navigation.navigate("xPsychologistRegister")} onlylabel/>
          <KMainButton title = "LOGIN AS USER" callback = {() => navigation.navigate("xUserLogin")} secondary/>
        </View>

        
        <AwesomeAlert
            show={uploading}
            progressColor="white"
            contentContainerStyle={{ backgroundColor : 'transparent'}}
            overlayStyle = {{ backgroundColor : '#00000044'}}
            progressSize={50}
            showProgress={true}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            confirmButtonColor="#DD6B55"
          />

        <View></View>
      </ScrollView>
    </LinearGradient>
  );
};
export default PsychologistLogin;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
});
