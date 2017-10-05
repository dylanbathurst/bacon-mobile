import './shim';
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import createSensitiveStorage from 'redux-persist-sensitive-storage';
import reducer, { initialState } from './src/Reducer.js';
import AppWithNavigationState from './src/Navigation';
import { logger } from 'redux-logger';

const store = createStore(
  reducer,
  initialState,
  compose(autoRehydrate()),
  applyMiddleware(logger)
);

persistStore(store, {
  storage: createSensitiveStorage()
});
// uncomment out the line below and comment out the line
// above to purge the local storage in order to reset the app data like accounts
// persistStore(store, {storage: createSensitiveStorage()}).purge();

export default class WalletAppWithNav extends Component {
  render () {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('baconer3', () => WalletAppWithNav);
