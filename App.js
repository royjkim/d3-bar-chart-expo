import React from 'react';
import { StyleSheet, WebView } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <WebView
        source={{ uri: 'http://roy.dothome.co.kr/d3/barChart.html'}}
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24
  },
});
