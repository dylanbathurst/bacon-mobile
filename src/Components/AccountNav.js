 import React, { Component } from 'react';
 import {
   AppRegistry,StyleSheet,
   Text, TextInput, Modal, FlatList, TouchableOpacity,
   TouchableHighlight, TouchableWithoutFeedback, View, Image
 } from 'react-native';
 import Account from './Account';
 import async from 'async';
 import { connect } from 'react-redux';
 import { syncAccounts } from '../Actions';
 import ethWallet from 'ethereumjs-wallet';
 import AccountCreateModal from './AccountCreate';
 import web3 from '../lib/web3Connection';

class AccountNav extends Component {
  static defaultProps = {
    ...Component.defaultProps,
    accountIcon: {
      uri: 'https://www.ethereum.org/images/logos/ETHEREUM-ICON_Black.png'
    }
  }

  constructor (props) {
    super(props);

    this.state = {
      modalVisible: false,
      newAccountName: '',
      importedKey: ''
    };
  }

  importAccount () {
    let fixtureKey = Buffer.from(this.state.importedKey, 'hex');
    let fixtureAccount = ethWallet.fromPrivateKey(fixtureKey);
    
    web3.eth.getBalance(fixtureAccount.getChecksumAddressString(),
    (err, balance) => {
      if (err) throw err;
      let amount = parseFloat(web3.fromWei(balance));

      this.props.dispatch(syncAccounts([{
        accountName: this.state.newAccountName,
        accountType: 'Ether',
        publicKey: fixtureAccount.getAddressString(),
        privateKey: fixtureKey,
        accountAmount: amount
      }]))
    });
  }

  createAccount () {
    this.setState({ modalVisible: false });

    if (!this.state.newAccountName) { // user didn't input an account name
      return;
    }

    if (this.state.importedKey) { // user didn't input an account name
      return this.importAccount();
    }

    web3.personal.newAccount((err, newAccount) => {
      if (err) throw err;

      this.props.dispatch(syncAccounts([{
        accountName: this.state.newAccountName,
        accountType: 'Ether',
        publicKey: newAccount,
        accountAmount: 0
      }]))
    });
  }

  render () {
    let modalVisible = this.state.modalVisible;

    return (
      <View style={styles.accountContainer}>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {}} >
          <AccountCreateModal
            modalVisible={() => this.setState({ modalVisible: false })} />
        </Modal>

        <TouchableOpacity
           style={styles.accountNavCreate}
           onPress={() => {this.setState({modalVisible: true})}}>
          <Image style={styles.accountIcon} source={this.props.accountIcon} />
          <Text style={styles.accountNavText}>Create new account...</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  accountContainer: {
    flex: 0,
    marginTop: 30,
    paddingLeft: 15,
  },
  accountIcon: {
    backgroundColor: "#fff",
    borderRadius: 13,
    width: 25,
    height: 25,
  },
  accountNavText: {
    flex: 1,
    color: '#aac3b9',
    marginTop: 3,
    paddingLeft: 17
  },
  accountNavCreate: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },

  accountNavImport: {
    padding: 10,
    width: '49%',
    backgroundColor: '#59897a',
    borderRadius: 3
  },
  newAccountModalInput: {
    borderWidth: 1
  },
});

export default connect()(AccountNav);
