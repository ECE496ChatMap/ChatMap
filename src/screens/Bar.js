/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

export default class Bar extends Component<{}> {
  render() {
    return (
      <View style={styles.bar}>
        <View style={[styles.barItem, styles.barSeperator]}>
          <Text style={styles.barTop}>25 </Text>
          <Text style={styles.barBottom}>Questions </Text>
        </View>

        <View style={styles.barItem}>
          <Text style={styles.barTop}>2023 </Text>
          <Text style={styles.barBottom}>Answers </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bar: {
    borderTopColor: '#fff',
    borderTopWidth: 4,
    backgroundColor: '#ec2e4a',
    flexDirection: 'row'
  },
  barSeperator: {
    borderRightWidth: 4
  },
  barTop: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  barBottom: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold'
  },
  barItem: {
    flex: 1,
    padding: 18,
    alignItems: 'center'
  }
});
