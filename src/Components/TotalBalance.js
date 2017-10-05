import React, { Component } from 'react';
import { AppRegistry, View, StyleSheet, Text, Image } from 'react-native';
import { FormattedCurrency, FormattedNumber } from 'react-native-globalize';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class TotalBalance extends Component {
  constructor (props) {
    super(props);
    this.state = {
      usdAmount: 0,
      ethAmount: 0
    }
  }

  componentDidMount () {
    this.calculateBalance();
    this.calculateEthBalance();
  }

  calculateEthBalance () {
    let mapped = this.props.accounts.map((item) => {
      return item.accountAmount;
    });

    let ethAmount = mapped.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    })

    this.setState({ ethAmount })
  }

  calculateBalance () {
    let mapped = this.props.accounts.map((item) => {
      return item.accountAmount;
    });

    let totalEthBalance = mapped.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    })

    fetch('https://api.coinbase.com/v2/exchange-rates?currency=ETH')
      .then((response) => response.json())
      .then((responseJson) => {
        let usdAmount = responseJson.data.rates['USD'] * totalEthBalance;
        this.setState({ usdAmount });
      });
  }

  render () {
    return (
      <View style={styles.totalBalanceContainer}>
        <FormattedCurrency
          value={this.state.usdAmount}
          currency="USD"
          style={styles.totalBalance} />
        <Text style={styles.currencyBalances}>
          <FormattedNumber
            value={this.state.ethAmount}
            minimumFractionDigits={4}/> ETH</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  totalBalanceContainer: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  totalBalance: {
    marginTop: 35,
    width: '100%',
    textAlign: 'center',
    fontSize: 40,
    fontWeight: '200',
    color: '#fff'
  },
  currencyBalances: {
    width: '100%',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '100',
    color: '#aac3b9'
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginLeft: 20
  },
});

TotalBalance.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

mapStateToProps = (state) => ({
  accounts: state.accounts
});

export default connect(mapStateToProps)(TotalBalance);
