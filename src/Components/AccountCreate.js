 import React, { Component } from 'react';
 import {
   AppRegistry,StyleSheet,
   Text, TextInput, TouchableOpacity,
   TouchableHighlight, TouchableWithoutFeedback, View, Image
 } from 'react-native';
 import PropTypes from 'prop-types';
 import Account from './Account';
 import web3 from '../lib/web3Connection';
 import async from 'async';
 import { connect } from 'react-redux';
 import { syncAccounts } from '../Actions';
 import ethWallet from 'ethereumjs-wallet';
 import { toBuffer, isValidPrivate, addHexPrefix,
          stripHexPrefix } from 'ethereumjs-util';

// Currently this is a modal that pops up
// it should allow you to input an account name
// it should allow you to optionally insert a privateKey
// it should import the privateKey, verify it and publicKey, and update redux
// it should create a new set of keys if no privateKey was entered
// it should allow you to dismiss the modal
// future: it should allow you to pick the kind of coin to use (ETH, BTC, etc.)
class AccountCreate extends Component {
  constructor (props) {
    super(props);

    this.state = {
      newAccountName: '',
      privateKey: '',
      publicKey: '',
      accountType: 'Ether',
      modalError: false,
      modalErrorMsg: ''
    };
  }

  vanillaAccount () {
    const newAccount = ethWallet.generate()
    const privateKey = newAccount.getPrivateKeyString()
    const publicKey = newAccount.getAddressString()

    return {
      accountName: this.state.newAccountName,
      accountType: this.state.accountType,
      privateKey: stripHexPrefix(privateKey),
      publicKey: publicKey,
    }
  }

  importAccount () {
    const privateKeyBuffer = Buffer.from(this.state.privateKey, 'hex')
    const importedAccount = ethWallet.fromPrivateKey(privateKeyBuffer)
    const privateKey = importedAccount.getPrivateKeyString()
    const publicKey = importedAccount.getAddressString()

    return {
      accountName: this.state.newAccountName,
      accountType: this.state.accountType,
      privateKey: stripHexPrefix(privateKey),
      publicKey: publicKey,
    }
  }

  createAccount () {
    this.state.modalError = false;
    this.state.modalErrorMsg = '';

    let accountToCreate = {};
    if (this.state.privateKey) { // user input a privateKey
      // form validation
      if (!isValidPrivate(toBuffer(addHexPrefix(this.state.privateKey)))) {
        this.setState({ modalErrorMsg: 'The Private Key is invalid' })
        this.setState({ modalError: true })
        return;
      }

      // check to see if the account has already been imported before
      let accountExists = this.props.accounts.filter((account) => {
        return addHexPrefix(this.state.privateKey) === account.keys.privateKey;
      })

      if (accountExists.length) {
        this.setState({ modalErrorMsg: 'This account is already imported' })
        this.setState({ modalError: true })
        return;
      }

      accountToCreate = this.importAccount();
    } else { // generate new private and public keys
      accountToCreate = this.vanillaAccount();
    }

    this.props.dispatch(syncAccounts([accountToCreate]))

    this.props.modalVisible();
    // web3.personal.newAccount((err, newAccount) => {
    // });
  }

  render () {
    return (
      <View style={{marginTop: 22}}>
        <View>
          <TouchableHighlight onPress={this.props.modalVisible}>
            <Text>Hide Modal</Text>
          </TouchableHighlight>
          <TextInput
            style={styles.newAccountModalInput}
            autoFocus={true}
            placeholder='Savings'
            keyboardType='default'
            onChangeText={(newAccountName) => this.setState({ newAccountName })}
            onSubmitEditing={() => this.createAccount()}
            returnKeyType='done' />

          <TextInput
            style={styles.newAccountModalInput}
            autoFocus={false}
            placeholder='Raw Key'
            keyboardType='default'
            onChangeText={(privateKey) => this.setState({ privateKey })}
            onSubmitEditing={() => this.createAccount()}
            returnKeyType='done' />
        </View>

        { this.state.modalError &&
          <Text>{this.state.modalErrorMsg}</Text>
        }
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

mapStateToProps = (state) => ({
  accounts: state.accounts
});

export default connect(mapStateToProps)(AccountCreate);
