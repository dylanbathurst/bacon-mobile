import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, StyleSheet, Text,
  TouchableOpacity, Image, TextInput
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import ModalDropdown from 'react-native-modal-dropdown';
import { connect } from 'react-redux';
import HeaderStyle from '../Styles/HeaderStyle.js';
import ethWallet, { fromPrivateKey } from 'ethereumjs-wallet';
import ethTx from 'ethereumjs-tx';
import ethUtil, { toBuffer } from 'ethereumjs-util';
import web3 from '../lib/web3Connection';

class SendTransaction extends Component {
  constructor (props) {
    super(props);
    this.state = {
      txAmount: '1',
      txTo: '',
      fromAccount: {
        publicKey: this.props.accounts[0].publicKey,
        privateKey: this.props.accounts[0].privateKey
      },
      xButton: {
        uri: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Qr-code-ver-10.png'
      }
    };
  }

  _dropdownRenderRow (rowData, rowID, highlighted) {
    return (
      <Text>{`${rowData.accountName}`}</Text>
    )
  }

  _dropdownSelectRow (idx, fromAccount) {
    this.setState({ fromAccount });
  }

  _buildTransaction () {
    let ethAccount = fromPrivateKey(toBuffer(this.state.fromAccount.privateKey))
    let fromAddress = ethAccount.getAddressString()
    let fromPrivateKeyBuffer = ethAccount.getPrivateKey()

    web3.eth.getTransactionCount(fromAddress,
      (err, count) => {
        if (err) throw err;

        let txData = {
          gasPrice: web3.toHex(20000000000),
          gasLimit: web3.toHex(21000),
          to: this.state.txTo,
          value: web3.toHex(web3.toWei(this.state.txAmount, 'ether')),
          nonce: web3.toHex(count)
        };

        const tx = new ethTx(txData);
        console.log('FOOOO', fromPrivateKeyBuffer)
        tx.sign(fromPrivateKeyBuffer);
        let serializedTx = tx.serialize().toString('hex');

        web3.eth.sendRawTransaction(`0x${serializedTx}`, (err, txHash) => {
          console.log(err, txHash);
        });
      });
  }

  static navigationOptions = ({ navigation }) => {
    const xButton = {
      uri: 'https://cdn1.iconfinder.com/data/icons/aye-ayecons/32/04-mark-512.png'
    };
    // should pass this in from some global uer context probably...
    const qrCode = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Qr-code-ver-10.png'
    };

    return {
      title: (
        <View style={HeaderStyle.sendTitle}>
          <Text style={HeaderStyle.sendTitleText}>SEND</Text>
        </View>
      ),
      headerLeft: (
        <TouchableOpacity onPress={() => {navigation.dispatch(NavigationActions.back())}}>
            <Image style={HeaderStyle.xButton} source={xButton} />
        </TouchableOpacity>
      ),
      headerRight: (
        <Image style={HeaderStyle.qrCode} source={qrCode} />
      ),
    };
  };

  render () {
    const { params } = this.props.navigation.state;

    return (
      <View style={styles.sendTransactionContainer}>
        <View style={styles.sendTransactionToContainer}>
          <Text style={styles.sendTransactionTo}>TO</Text>
          <TextInput
            style={styles.sendTransactionToAddress}
            onChangeText={(txTo) => this.setState({ txTo })}
            numberOfLines={1} />
        </View>
        <View style={styles.sendTransactionFromContainer}>
          <Text style={styles.sendTransactionFrom}>FROM</Text>

          <ModalDropdown
            style={styles.transactionFromDrowpdown}
            options={this.props.accounts}
            renderRow={this._dropdownRenderRow.bind(this)}
            onSelect={(idx, value) => this._dropdownSelectRow(idx, value)}>
            <Text>{`${this.state.fromAccount.publicKey}`}</Text>
          </ModalDropdown>
        </View>
        <View style={styles.sendTransactionAmountContainer}>
          <Text style={styles.sendTransactionAmountText}>AMOUNT</Text>
          <TextInput
            style={styles.sendTransactionAmount}
            defaultValue={this.state.txAmount}
            onChangeText={(txAmount) => this.setState({txAmount})}
            keyboardType='numeric' />
        </View>
        <TouchableOpacity
          style={styles.sendTransactionButton}
          onPress={this._buildTransaction.bind(this)}>
          <Text style={styles.sendTransactionButtonText}>PROCEED TO CONFIRMATION</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  sendTransactionContainer: {
    paddingRight: 15,
    paddingLeft: 15,
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  sendTransactionToContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  sendTransactionFromContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  sendTransactionAmountContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },

  sendTransactionTo: {
    flex: 1
  },

  sendTransactionToAddress: {
    flex: 2
  },

  sendTransactionFrom: {
    flex: 1
  },
  sendTransactionFromAddress: {
    flex: 2
  },

  sendTransactionAmountText: {
    flex: 1
  },
  sendTransactionAmount: {
    flex: 2
  },

  sendTransactionButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    padding: 10,
  },
  sendTransactionButton: {
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#e65200',
    overflow: 'hidden',
  },
  transactionFromDrowpdown: {
    flex: 2,
  },
});

SendTransaction.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    state: PropTypes.shape({}).isRequired
  })
};

mapStateToProps = (state) => ({
  accounts: state.accounts
});

export default connect(mapStateToProps)(SendTransaction);
