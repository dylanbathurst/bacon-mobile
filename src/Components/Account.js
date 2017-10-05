import React, { Component } from 'react';
import { AppRegistry,StyleSheet, Text, TextInput,
   TouchableOpacity, TouchableWithoutFeedback,
   View, Image } from 'react-native';
import AccountMaintenance from './AccountMaintenance.js';
import { FormattedCurrency, FormattedNumber } from 'react-native-globalize';
import { connect } from 'react-redux';
import { updateAccountBalance } from '../Actions';
import web3 from '../lib/web3Connection';

// Account lifecycle
// needs a crypto type to determine what kind of coin it is (ETH, BTC, etc.)
// needs a privateKey and publicKey to spin up
// needs an account name set or default to 'New Account'
// should request balance from chain and refresh balance every 5 seconds
// should ping a service to get it's USD value every 5 seconds
// should enable to change name after creation
// needs to generate a qrCode
class Account extends Component {
  constructor (props) {
    super(props);

    this.accountUpdateTimer = () => {};

    this.state = {
      accountType: this.props.data.accountType,
      privateKey: this.props.data.privateKey,
      publicKey: this.props.data.publicKey,
      accountName: this.props.data.accountName || 'New Account',
      accountAmount: this.props.data.accountAmount || 0,
      accountAmountUSD: 0,
      accountIcon: this._setAccountIcon(this.props.data.accountType),
      qrCode: this._generateAccountQRCode(this.props.data.publicKey),
      showAccount: false,
      isFetching: false
    };
  }

  componentDidMount () {
    this.accountUpdateTimer = setInterval(this._updateEthAmount.bind(this), 15000);
    this.accountAmountUSDTimer = setInterval(this._updateUSDAmount.bind(this), 5000);
    this._updateEthAmount();
    this._updateUSDAmount();
  }

  componentWillUnmount () {
    clearTimeout(this.accountUpdateTimer);
    clearTimeout(this.accountAmountUSDTimer);
  }

  _setAccountIcon (accountType) {
    const iconList = {
      'Ether': {
        uri: 'https://www.ethereum.org/images/logos/ETHEREUM-ICON_Black.png'
      },
      'BTC': {
        uri: 'someBitcoinIcon'
      }
    }

    return iconList[accountType]
  }

  _generateAccountQRCode (publicKey) {
    // generate qr code somehow
    const qrCode = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Qr-code-ver-10.png'
    }

    return qrCode
  }

  _editWalletName (accountName, privateKey) {
    this.setState({ accountName })
  }

  _updateUSDAmount () {
    fetch('https://api.coinbase.com/v2/exchange-rates?currency=ETH')
      .then((response) => response.json())
      .then((responseJson) => {
        let accountAmountUSD = responseJson.data.rates['USD'] * this.state.accountAmount;
        this.setState({ accountAmountUSD });
      });
  }

  _updateEthAmount () {
    if (this.state.isFetching) return
    let isFetching = !this.state.isFetching
    this.setState({ isFetching }) // isFetching == true

    let privateKeyString = this.state.privateKey;
    let publicKeyString = this.state.publicKey;
    console.log(publicKeyString, privateKeyString);
    web3.eth.getBalance(publicKeyString, (err, balance) => {
      if (err) throw err;

      let isFetching = !this.state.isFetching
      this.setState({ isFetching }); // isFetching == false
      let accountAmount = parseFloat(web3.fromWei(balance));

      this.setState({ accountAmount });
      // dispatch account amount update
      this.props
          .dispatch(updateAccountBalance(privateKeyString, accountAmount))
    });
  }

  _expandWallet () {
    if (this.state.showAccount) {
      this.setState({showAccount: false});
    } else {
      this.setState({showAccount: true});
    }
  }

  render () {
    return (
      <View style={styles.accountContainer}>

        <TouchableOpacity
          onPress={this._expandWallet.bind(this)}>

          <View style={styles.accountMetaContainer}>
            <View style={styles.accountMetaSection}>
              <Image style={styles.accountIcon} source={this.state.accountIcon} />
              <View>
                <TextInput
                  value={this.state.accountName}
                  style={styles.accountName}
                  onChangeText={(text) => { this._editWalletName(text, this.state.privateKey) }} />
                <Text numberOfLines={1} ellipsizeMode={'middle'} style={styles.publicKey}>{this.state.publicKey}</Text>
              </View>
            </View>

            <View style={styles.accountAmounts}>
              <Text style={styles.accountAmountUSD}>
                <FormattedCurrency
                  value={this.state.accountAmountUSD}
                  currency="USD" /> USD</Text>

              <Text style={styles.accountAmount}>
                <FormattedNumber
                  value={this.state.accountAmount}
                  minimumFractionDigits={4}/> ETH</Text>
            </View>
          </View>
        </TouchableOpacity>

        { this.state.showAccount &&
          <View style={styles.toggleView}>
            <AccountMaintenance account={this.props.data} />
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  accountContainer: {
    flex: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#6d9689'
  },
  accountMetaContainer: {
    flex: 0,
    paddingTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accountMetaSection: {
    flex: 1,
    flexDirection: 'row',
  },
  accountName: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
    color: '#fff'
  },
  publicKey: {
    fontSize: 16,
    marginTop: 7,
    width: 100,
    color: '#aac3b9'
  },
  accountAmounts: {
    width:'35%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingRight: 15,
  },
  accountAmountUSD: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'right',
    fontSize: 16,
  },
  accountAmount: {
    color: '#fff',
    textAlign: 'right',
    fontSize: 16,
    color: '#aac3b9'
  },
  accountIcon: {
    width: 40,
    height: 40,
    marginLeft: 7,
    marginRight: 10
  },
  qrCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
    paddingLeft: 10,
  },
  qrCode: {
    width: 50,
    height: 50,
  },
});

export default connect()(Account);
