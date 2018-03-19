import React, { Component } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const MapInput = (props) => {
  return (
    <View>
      <TextInput
        {...this.props}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {

    width: 300,
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23
  },
  label: {
    fontSize: 18,
    paddingLeft: 20
  },
  container: {
    height: 50,
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10
  }
})


export { MapInput }
