import React, { Component } from 'react'
import { View, Text, TouchableOpacity,
  StyleSheet, Clipboard, Modal } from 'react-native'
import { connect } from 'react-redux'

class AccountMaintenance extends Component {
  constructor (props) {
    super(props)

    this.state = {
      modalVisible: false
    }
  }

  copyAddressToClipboard () {
    Clipboard.setString(this.props.account.publicKey);
    this.setState({ modalVisible: true })
    setTimeout(() => {
      this.setState({ modalVisible: false })
    }, 1200)
  }

  copyPrivateKeyToClipboard () {
    Clipboard.setString(this.props.account.privateKey);
    this.setState({ modalVisible: true })
    setTimeout(() => {
      this.setState({ modalVisible: false })
    }, 1200)
  }

  render () {
    return (
      <View>
        <TouchableOpacity
          style={styles.copyAddress}
          onPress={this.copyAddressToClipboard.bind(this)}>
          <Text style={styles.copyAddressText}>Copy Address To Keyboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.exportPrivateKey}
          onPress={this.copyPrivateKeyToClipboard.bind(this)}>
          <Text style={styles.copyAddressText}>Export Private Key</Text>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {}} >
          <View style={styles.clipboardModal}>
            <View style={styles.successfullyCopied}>
              <Text style={styles.successfullyCopiedText}>Copied</Text>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {}} >
          <View style={styles.clipboardModal}>
            <View style={styles.successfullyCopied}>
              <Text style={styles.successfullyCopiedText}>Copied</Text>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  copyAddressText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    padding: 10,
  },
  copyAddress: {
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#e65200',
    overflow: 'hidden',
  },
  exportPrivateKey: {
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    opacity: .2,
    overflow: 'hidden',
  },
  clipboardModal: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successfullyCopied: {
    borderRadius: 10,
    height: 100,
    width: 100,
    backgroundColor: '#333',
    opacity: .7
  },
  successfullyCopiedText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#fff',
    fontWeight: 'bold'
  }
})

export default connect()(AccountMaintenance)
