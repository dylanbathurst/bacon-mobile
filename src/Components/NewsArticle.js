import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Dimensions,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight
} from 'react-native';

export default class NewsArticle extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  handleArticleTouchEvent () {
    const { navigate } = this.props.navigation;

    navigate('Webview', {
      title: this.props.title,
      url: this.props.url
    });
  }

  render () {
    return (
      <TouchableHighlight onPress={this.handleArticleTouchEvent.bind(this)} underlayColor={'transparent'}>
        <View style={styles.newsContainer}>
          <Image style={styles.newsPhoto} source={{uri: this.props.image}} />
          <View>
            <Text numberOfLines={2} style={styles.newsHeader}>
              {this.props.title}
            </Text>
            <Text style={styles.newsMeta}>
              {this.props.publicationDate}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  newsContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width
  },
  newsPhoto: {
    width: 60,
    height: 60,
    borderRadius: 3,
    backgroundColor: '#fff'
  },
  newsHeader: {
    width: Dimensions.get('window').width - 100,
    marginLeft: 15,
    fontSize: 18,
    fontWeight: '300',
    color: '#fff'
  },
  newsMeta: {
    marginLeft: 15,
    marginTop: 5,
    fontSize: 12,
    fontWeight: '100',
    color: '#aac3b9'
  }
});

AppRegistry.registerComponent('newsarticle', () => NewsArticle);
