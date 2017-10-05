import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  AppRegistry,
  ScrollView,
  Dimensions,
  View,
  Text,
  AlertIOS,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

import NewsArticle from './NewsArticle.js';

export default class NewsTicker extends Component {
  constructor () {
    super()
    this.state = {
      loading: true,
      articles: []
    }
  }

  contructApiUrl (opts) {
    const url = 'https://content.guardianapis.com/search';
    let params = '';

    Object.entries(opts).map(function ([key, value], i) {
      if (i == 0) {
        params += '?' + key.replace(/[_]/g, '-') + '=' + value;
      } else {
        params += '&' + key.replace(/[_]/g, '-') + '=' + value;
      }
    });

    return url + params;
  }

  fetchNewsArticles () {
    let options = {
      api_key: 'c57a70f2-0b51-425b-8c23-88aa4e8a02d3',
      q: 'bitcoin OR ethereum OR cryptocurrency',
      page_size: '5',
      show_fields: 'thumbnail'
    }

    fetch(this.contructApiUrl(options))
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          loading: false,
          articles: responseJson.response.results
        });
      })
      .catch((error) => {
        AlertIOS.alert(
         "Can't fetch the news",
         "Please try again in a minute"
        );
      });
  }

  componentWillMount () {
    this.fetchNewsArticles();
  }

  render () {
    const { store } = this.context;
    const navigation = this.props.navigation;

    let articles = this.state.articles.map(function(object, index) {
      return (
        <NewsArticle
          title={object.webTitle}
          publicationDate={new Date(object.webPublicationDate).toString()}
          url={object.webUrl}
          image={object.fields.thumbnail}
          navigation={navigation}
          key={index} />
      )
    });


    return (
      <View style={styles.wrapper}>
        <ScrollView horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false}>
          {this.state.loading &&
            <ActivityIndicator color='#fff' style={styles.loadingIndicator} />
          }
          {articles}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 30
  },
  loadingIndicator: {
    width: Dimensions.get('window').width,
    height: 62
  }
});

NewsTicker.propTypes = {
  store: PropTypes.object
};

AppRegistry.registerComponent('newsticker', () => NewsTicker);
