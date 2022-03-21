import React, { useState, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import {Image, View, Text, TouchableOpacity, StyleSheet, Dimensions, PixelRatio, SegmentedControlIOSBase } from 'react-native';
import { prototype } from 'events';
import { color } from 'react-native-reanimated';
import { BlueSpacing10 } from '../BlueComponents';

const styles = StyleSheet.create({
    container1: {
      flex: 1,
      backgroundColor: '#FFFACA',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container2: {
      flex: 1,
      backgroundColor: '#CAF5FF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      backgroundColor: '#ffffff',
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
export const MerchantCard = ({攤商GUID, 攤商圖片, 攤商名稱, 攤商介紹, onPress, index}) => {
  return (
        <View style={index%2==0? styles.container1: styles.container2}>
            <Text style={{fontSize: 24}}>{攤商名稱}</Text>
            <Image
                    style={{width:'60%', height:200}}
                    source={{uri: `http://10.0.2.2:3101/Images/merchantAvator/${攤商圖片}`}}
                />
            <BlueSpacing10></BlueSpacing10>
            
            <Text style={{fontSize: 16}}>{攤商介紹}</Text>
            <BlueSpacing10></BlueSpacing10>
            <TouchableOpacity style={styles.button} accessibilityRole="button" onPress={onPress}>
                <Text style={{fontSize: 24}}>前往攤位</Text>
            </TouchableOpacity>
        </View>
    );
};

MerchantCard.propTypes = {
    text: PropTypes.string,
    imgSrc: PropTypes.string,
    onPress: PropTypes.func
};