import React, { useState, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { TextInput, Image, View, Text, TouchableOpacity, StyleSheet, Dimensions, PixelRatio, SegmentedControlIOSBase } from 'react-native';
import { prototype } from 'events';
import { color } from 'react-native-reanimated';
import { BlueSpacing10, BlueSpacing20, BlueSpacing40 } from '../BlueComponents';

const styles = StyleSheet.create({
    container1: {
      flex: 1,
      backgroundColor: '#FFFACA',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30
    },
    container2: {
      flex: 1,
      backgroundColor: '#CAF5FF',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30
    },
    intro: {
      width: '80%',
      backgroundColor: '#ffffff',
      borderRadius: 10,
      alignItems: 'center',
      height: 80
    },
    button: {
      backgroundColor: 'pink',
      borderRadius: 10,
      padding: 10,
      marginBottom: 20,
      shadowColor: '#303838',
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 10,
      shadowOpacity: 0.35,
      alignItems: 'center',
      width:'100%',
    },
    
  });
export const StockCard = ({商品名稱, 商品圖片, 商品介紹, 商品數量, 商品價格, onPress, index}) => {
  //console.log("印出", 商品名稱)

  const [amount, setAmount] = useState(1);
  

  return (
        <View style={index%2==0? styles.container1: styles.container2}>
            <BlueSpacing10></BlueSpacing10>
            <Text style={{fontSize: 24}}>{商品名稱}</Text>
            <BlueSpacing20></BlueSpacing20>
            <Image
                    style={{width:'60%', height:180, borderRadius: 10}}
                    source={{uri: `http://10.0.2.2:3101/Images/stock/${商品圖片}`}}
                />
            <BlueSpacing20></BlueSpacing20>
            <View style={styles.intro}>
              <View style={{width:'90%', marginTop: 5}}>
                <Text style={{fontSize: 16}}>{商品介紹}</Text>
              </View>
              
            </View>
            
            <BlueSpacing10></BlueSpacing10>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '40%'}}>
                <BlueSpacing10></BlueSpacing10>
                <BlueSpacing40></BlueSpacing40>
                <Text style={{ marginTop: 8,fontSize: 16}}>剩餘數量: {商品數量}</Text>
                <Text style={{fontSize: 16}}>價格(NTD): {商品價格}</Text>
              </View>
              <View style={{width: '40%'}}>
              <BlueSpacing10></BlueSpacing10>
                <TextInput
                  name="amount"
                  value='1'
                  placeholder='數量'
                  type="number"
                  keyboardType='numeric'
                  style={{
                      borderWidth:0.5,
                      borderColor: "grey",
                      fontSize: 16,
                      borderRadius: 10,
                      backgroundColor: 'white'
                  }}
                  onChangeText={event => {setAmount(event)}}
                />
                <BlueSpacing10></BlueSpacing10>
                <TouchableOpacity 
                  style={styles.button} 
                  accessibilityRole="button" 
                  onPress={()=>onPress.addToCart(onPress.商品GUID, amount, onPress.消費者GUID)}>
                  <Text style={{fontSize: 16}}>加入購物車</Text>
                </TouchableOpacity>
              </View>
              
            </View>
            <BlueSpacing20></BlueSpacing20>
        </View>
    );
};

StockCard.propTypes = {
    onPress: PropTypes.func
};