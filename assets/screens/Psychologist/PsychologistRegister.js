import React, { Component, useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, TextInput, Image, StatusBar, Modal, Button, BackHandler, Alert } from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import FilePickerManager from 'react-native-file-picker';
import ImagePicker from 'react-native-image-picker';
import uuid from 'react-uuid';
//++++++++++++++  ui  +++++++++++++++++
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Avatar, Accessory } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import * as Progress from 'react-native-progress';
import AwesomeLoading from 'react-native-awesome-loading';
import NumericInput from 'react-native-numeric-input';
import AwesomeAlert from 'react-native-awesome-alerts';
//+++++++++++++++ firebase +++++++++++++
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
//+++++++++++++++ custom +++++++++++++++
import KTextInput from '../../components/KTextInput';
import KMainButton from '../../components/KMainButton';
import { registerVersion } from 'firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';

// import auth from '@react-native-firebase/auth';
const psychologistRef = firestore().collection('psychologists');
function PsychologistRegister({ navigation }) {
  const [avatarsource, setAvatarsource] = useState("");
  const [avatarimage, setAvatarimage] = useState({
    uri: 'https://previews.123rf.com/images/tomozina/tomozina1701/tomozina170100184/70669296-avatar-des-mannes-mit-rotem-bart-symbol-in-sozialen-netzwerken-vektor-illustration-.jpg'
  });


  const [email, setEmail] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState(0);

  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  var imageNameOnStorage = "";
  var radio_gender_props = [
    { label: 'MALE', value: 0 },
    { label: 'FEMALE', value: 1 }
  ];
  const onSignUp = () => {

    if (avatarsource == "") {
      Toast.showWithGravity('Please choose your avatar.', Toast.SHORT, Toast.TOP);
    } else if (email == "") {
      Toast.showWithGravity('Please input email.', Toast.SHORT, Toast.TOP);
    } else if (username == "") {
      Toast.showWithGravity('Please input username.', Toast.SHORT, Toast.TOP);
    } else if (password == "") {
      Toast.showWithGravity('Please input password.', Toast.SHORT, Toast.TOP);
    } else if (password.length < 8) {
      Toast.showWithGravity('Password length should be at least 8.', Toast.SHORT, Toast.TOP);
    } else if (confirmpassword == "") {
      Toast.showWithGravity('Please confirm password.', Toast.SHORT, Toast.TOP);
    } else if (password != confirmpassword) {
      Toast.showWithGravity('Password is not match.', Toast.SHORT, Toast.TOP);
    } else {
      console.log("avatar = ", imageNameOnStorage);
      console.log("email = ", email);
      console.log("username = ", username);
      console.log("password = ", password);
      console.log("confirm password = ", confirmpassword);
      setUploading(true);

      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          uploadImage();

          psychologistRef.add({
            email: email,
            username: username,
            password: password,
            avatar: imageNameOnStorage
          }).then(() => console.log("firestore added."));
          Toast.showWithGravity('Psychologist account created', Toast.SHORT, Toast.TOP);
          navigation.pop();
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            Toast.show('That email address is already in use');
          } else if (error.code === 'auth/invalid-email') {
            Toast.show('That email address is invalid');
          } else {
            Toast.show(error.code);
          }
        });
      setUploading(false);
    }
  }

  async function getPathForFirebaseStorage(uri) {
    if (Platform.OS === "ios") return uri
    const stat = await RNFetchBlob.fs.stat(uri)
    return stat.path
  }

  const uploadImage = async () => {
    const { uri } = avatarsource;
    imageNameOnStorage = uuid();
    const data = await RNFS.readFile(uri, 'base64')
    const task = storage(). ref(imageNameOnStorage).putString(data, 'base64')
    try {
      await task;
      console.log(" --> image uploaded");
    } catch (e) {
      console.error("--> image uploading failed --> ", e);
    }
  };

  const avatarSelected = () => {
    console.log("selected");
    var file = "";

    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      //console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        setAvatarsource(source);
        setAvatarimage({ uri: 'data:image/jpeg;base64,' + response.data });
      }
    });
  }

  return (
    <LinearGradient colors={['#001144', '#001144']} style={styles.linearGradient}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar hidden={true} />
        {/* <View style = {{height: '20%'}}></View>           */}

        <View style={{ alignItems: 'center', marginTop: '0%' }}  >
          <Text style={styles.titleText}> REGISTER </Text>
          {/* <Image source={require('../../images/AlwaysHereForYou.png')} style={{ width: 300, height: 180 }} /> */}
        </View>

        <View style={{ flexDirection: 'column', justifyContent: 'center', marginTop: 20, width: '80%', alignSelf: 'center', marginTop: '10%' }}>
          <TouchableOpacity
            style={styles.avatarTouchStyle}
            onPress={() => avatarSelected()}
          >
            <Avatar
              rounded
              size="xlarge"
              containerStyle={styles.avatarImageStyle}
              source={avatarimage}
            />
          </TouchableOpacity>


          <KTextInput placeholder="Email" onChangeText={email => setEmail(email)} />
          <KTextInput placeholder="Name" onChangeText={username => setUserName(username)} />
          <KTextInput placeholder="Password" onChangeText={password => setPassword(password)} password />
          <KTextInput placeholder="Confirm Password" onChangeText={confirmpassword => setConfirmPassword(confirmpassword)} password />
          {/* <KTextInput placeholder="Age" onChangeText={age => setAge(age)} />
          <RadioForm
            radio_props={radio_gender_props}
            initial={0}
            formHorizontal={true}
            onPress={(value) => { setGender(value) }}
            labelStyle={{ fontSize: 20, color: '#2ecc71' }}
            borderWidth={1}
            buttonInnerColor={'#e74c3c'}
            buttonSize={20}
            buttonOuterSize={30}
            buttonWrapStyle={{ marginLeft: 10 }}
            style={{ marginTop: 20, alignItems: 'center', justifyContent: 'space-around' }}
          /> */}
          <KMainButton title="SEND" callback={onSignUp} />

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
        </View>

        <View style={{ height: 40 }}></View>
      </ScrollView>
    </LinearGradient>
  );
};
export default PsychologistRegister;

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
    marginTop: 10,
    color: 'cyan',
    backgroundColor: 'transparent',
  },
  avatarTouchStyle: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 154,
    height: 154,
    alignSelf: 'center',
  },
  avatarImageStyle: {
    width: 150,
    height: 150,
    borderWidth: 2,
    borderColor: 'cyan'
  }
});
