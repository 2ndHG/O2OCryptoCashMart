import React, { useState, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, PixelRatio, SegmentedControlIOSBase } from 'react-native';
import { prototype } from 'events';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      backgroundColor: '#F9DC99',
      borderRadius: 20,
      padding: 10,
      marginBottom: 20,
      shadowColor: '#303838',
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 10,
      shadowOpacity: 0.35,
      alignItems: 'center',
      width:'80%',
    },
  });
export const LoginButton = ({text, imgSrc, onPress}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} accessibilityRole="button" onPress={onPress}>
                <Text style={{fontSize: 24}}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
};

LoginButton.propTypes = {
    text: PropTypes.string,
    imgSrc: PropTypes.string,
    onPress: PropTypes.func
};