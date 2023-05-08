import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';

export default class KButtonPink extends Component {

    onClick = () => {
        if (this.props.callback) {
            if (this.props.param != undefined) {
                this.props.callback(this.props.param);
            } else {
                this.props.callback();
            }
        }
    }

    render() {
        return (
            <TouchableOpacity
                onPress={ this.onClick } 
                style = {styles.loginScreenButton}
            >
                <Text style = {styles.loginText}> {this.props.title} </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },

  loginScreenButton:{
    marginRight:20,
    marginLeft:20,
    marginTop:10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor:'cyan',
    borderRadius:30,
    borderWidth: 2,
    borderColor: 'white',
    height : 50,
  },

  loginText:{
      color:'#fff',
      textAlign:'center',
      paddingTop : 8,
      fontSize: 18,
  }
});