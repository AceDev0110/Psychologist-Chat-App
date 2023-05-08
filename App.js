import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';

import { SafeAreaView, StyleSheet, ScrollView, View, Text, TextInput, Image, StatusBar, Button, } from 'react-native';
import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions, } from 'react-native/Libraries/NewAppScreen';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//--------------------  Screen  ---------------------------
import ChooseCategoryScreen from './assets/screens/User/ChooseCategoryScreen';
import PsychologistLogin from './assets/screens/Psychologist/PsychologistLogin';
import PsychologistRegister from './assets/screens/Psychologist/PsychologistRegister';
import PsychologistForgotPassword from './assets/screens/Psychologist/PsychologistForgotPassword';
import UserChatScreen from './assets/screens/Share/UserChatScreen';
import UserLogin from './assets/screens/User/UserLogin';
import UserRegister from './assets/screens/User/UserRegister';
import UserForgotPassword from './assets/screens/User/UserForgotPassword';
import ChooseClientScreen from './assets/screens/Share/ChooseClientScreen';
const Stack = createStackNavigator();

function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="xUserLogin" screenOptions={{ headerShown: false }} >
        <Stack.Screen name="xUserLogin" component={UserLogin} />
        <Stack.Screen name="xUserRegister" component={UserRegister} />
        <Stack.Screen name="xUserForgotPassword" component={UserForgotPassword} />
        <Stack.Screen name="xPsychologistLogin" component={PsychologistLogin} />
        <Stack.Screen name="xPsychologistRegister" component={PsychologistRegister} />
        <Stack.Screen name="xPsychologistForgotPassword" component={PsychologistForgotPassword} />
        <Stack.Screen name="xChooseCategoryScreen" component={ChooseCategoryScreen} />
        <Stack.Screen name="xChooseClientScreen" component={ChooseClientScreen} />
        <Stack.Screen name="xUserChatScreen" component={UserChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;