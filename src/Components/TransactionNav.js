import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {AppRegistry, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux'

class TransactionNav extends Component {
  render () {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.transactionNavContainer}>
        <TouchableOpacity
          style={styles.stretchButton}>
          <Text style={styles.transactionRequest}>REQUEST</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stretchButton}>
          <Text
            style={styles.transactionSend}
            onPress={() => navigate('SendTransaction')}>SEND</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  stretchButton: {
    flexGrow: 1,
    borderRightWidth: .5,
    borderRightColor: '#ddd'
  },
  transactionNavContainer: {
    flex: 0,
    bottom: 0,
    width: '100%',
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionRequest: {
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    padding:15,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'red',
    backgroundColor: '#fff'
  },
  transactionSend: {
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    padding:15,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'red',
    backgroundColor: '#fff'
  }
});

TransactionNav.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  navigation: PropTypes.shape({}).isRequired
};

mapStateToProps = (state) => ({
  accounts: state.accounts
});

export default connect(mapStateToProps)(TransactionNav);
