import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import App from './App.js';
import SendTransaction from './Components/SendTransaction.js';
import Webview from './Components/Webview.js';
import HeaderStyle from './Styles/HeaderStyle.js';

const BaconWalletNav = StackNavigator({
  Home: {
    screen: App
  },
  SendTransaction: {
    screen: SendTransaction
  },
  Webview: {
    screen: Webview,
  }
}, {
  // mode: 'modal',
  navigationOptions: {
    headerStyle: HeaderStyle.header,
    headerTintColor: '#fff'
  }
});

export default connect()(BaconWalletNav);
