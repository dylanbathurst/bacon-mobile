import React, { Component } from 'react';
import { AppRegistry, Text } from 'react-native';
import WalletApp from './Components/WalletApp.js';
import HeaderStyle from './Styles/HeaderStyle.js';
import { FormattedWrapper } from 'react-native-globalize';

export default class App extends Component {
  static navigationOptions = () => {
    return {
      headerLeft: <Text style={HeaderStyle.logo}>BACON</Text>
    }
  }

  render () {
    return (
      <FormattedWrapper locale="en" currency="USD">
        <WalletApp navigation={this.props.navigation} />
      </FormattedWrapper>
    );
  }
}

AppRegistry.registerComponent('App', () => App);
