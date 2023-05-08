import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';

export default class KTextInput extends Component {
 
  render() {
    return (
        <TextInput
            placeholder = {this.props.placeholder}
            placeholderTextColor = "#ffffffcc"
            style={styles.textInput}
            onChangeText={this.props.onChangeText}
            secureTextEntry={this.props.password} 
            // onChangeText={idValue => onChangeIdValue(idValue)}
            // value={idValue}
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff44'
  },
  
  textInput: {
    height: 45, 
    width: '100%',
    alignSelf : 'center',
    textAlign : 'center',
    
    color: "cyan",
    fontSize: 18,
    fontWeight: "normal",
    fontStyle: 'normal',
    
    borderColor: '#00ffffaa', 
    borderRadius: 10 , 
    borderWidth: 1 ,
    
    paddingLeft : 20, 
    paddingRight : 20, 
    paddingBottom:4,
    
    margin: 5,

    backgroundColor : 'rgba(255, 255, 255, 0.1)',
  },
});