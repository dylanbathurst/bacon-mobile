import React, { Component } from 'react';
import {AppRegistry, View, StyleSheet, Text, Image} from 'react-native';

export default class Header extends Component {
  constructor (props) {
    super(props);
    this.state = {
      qrCode: {
        uri: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Qr-code-ver-10.png'
      }
    };
  }
  render () {
    return (
      <View style={styles.header}>
        <Text style={styles.logo}>BACON</Text>
        <Image style={styles.qrCode} source={this.state.qrCode} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginLeft: 20
  },
  qrCode: {
    height: 30,
    width: 30,
    marginTop: 10,
    marginRight: 20
  },
});


AppRegistry.registerComponent('header', () => Header);
