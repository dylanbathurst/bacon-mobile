import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  WebView
} from 'react-native';

import HeaderStyle from '../Styles/HeaderStyle.js';

export default class Webview extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.title
    }
  }

  render () {
    const { params } = this.props.navigation.state;

    return (
      <WebView source={{uri: params.url}} />
    )
  }
}

AppRegistry.registerComponent('Webview', () => Webview);
