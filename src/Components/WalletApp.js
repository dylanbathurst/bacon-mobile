 import React, { Component } from 'react';
 import PropTypes from 'prop-types';
 import { AppRegistry, StatusBar, View, ScrollView,
   FlatList, StyleSheet, Image, Text } from 'react-native';
 import { connect } from 'react-redux'
 import async from 'async';
 import Account from './Account.js';
 import AccountNav from './AccountNav.js';
 import Header from './Header.js';
 import TotalBalance from './TotalBalance.js';
 import NewsTicker from './NewsTicker.js';
 import TransactionNav from './TransactionNav.js';
 import HeaderStyle from '../Styles/HeaderStyle.js';
 import { FormattedWrapper } from 'react-native-globalize';
 import { syncWallets } from '../Actions';

class WalletApp extends Component {
  render () {
    const hasAccounts = (this.props.accounts.length) ? true : false;
    const hasBalance = (this.props.accounts.length &&
                        this.props.accounts[0].accountAmount) ? true : false;

    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.accountListNavGroup}>
        { (hasAccounts && hasBalance) &&
          <TotalBalance accounts={this.props.accounts} />
        }
          <NewsTicker navigation={this.props.navigation} />
        { hasAccounts ? (
          <FlatList
            keyExtractor={ (item) => item.publicKey }
            data={this.props.accounts}
            style={styles.accountList}
            renderItem={({item}) => <Account data={item} />}
          />
        ) : (
          <Text style={styles.noAccounts}>
            You haven&apos;t created any accounts yet. Tap the button below
            to create your first account!
          </Text>
        )}
          <AccountNav />
        </ScrollView>
        { hasAccounts &&
          <TransactionNav navigation={this.props.navigation} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#598a7a'
  },
  accountList: {
    marginTop: 25,
  },
  accountListNavGroup: {
    flex: 1,
    backgroundColor: '#598a7a'
  },
  noAccounts: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    paddingLeft: 60,
    paddingRight: 60,
    marginTop: 30,
    color: '#aac3b9'
  }
});

WalletApp.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

mapStateToProps = (state) => ({
  accounts: state.accounts
});

export default connect(mapStateToProps)(WalletApp);
