import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity
} from 'react-native';

export default class KMainButton extends Component {

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
            <>
                {(!this.props.onlylabel && !this.props.secondary) && (
                    <TouchableOpacity
                        onPress={this.onClick}
                        style={styles.buttonPrimary}
                    >
                        <Text style={styles.labelPrimary}> {this.props.title} </Text>
                    </TouchableOpacity>
                )}

                {this.props.onlylabel && (
                    <TouchableOpacity
                        onPress={this.onClick}
                        style={styles.buttonOnlyLabel}
                    >
                        <Text style={styles.labelOnlylabel}> {this.props.title} </Text>
                    </TouchableOpacity>
                )}

                {this.props.secondary && (
                    <TouchableOpacity
                        onPress={this.onClick}
                        style={styles.buttonSecondary}
                    >
                        <Text style={styles.labelSecondary}> {this.props.title} </Text>
                    </TouchableOpacity>
                )}

            </>
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

    buttonPrimary: {
        marginRight: 40,
        marginLeft: 40,
        marginTop: 20,
        backgroundColor: 'cyan',
        borderRadius: 30,
        borderWidth: 0,
        borderColor: 'white',
        height: 50,
        justifyContent : 'center'
    },
    labelPrimary: {
        color: '#000',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold'
    },

    buttonSecondary: {
        marginRight: 40,
        marginLeft: 40,
        marginTop: 20,
        padding : 10,
        backgroundColor: 'rgba(0,255,255,0.2)',
        borderRadius: 30,
        borderWidth: 0,
        borderColor: 'white',
        justifyContent : 'center'
    },
    labelSecondary: {
        color: '#00ffffaa',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold'
    },

    buttonOnlyLabel: {
        marginRight: 40,
        marginLeft: 40,
        marginTop: 20,
        backgroundColor: 'transparent',
        borderWidth: 0,
        justifyContent : 'center'
    },
    labelOnlylabel: {
        color: '#00ffff88',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold'
    }    
});