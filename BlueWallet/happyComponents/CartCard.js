import React, { useState, useRef, forwardRef, useEffect } from 'react';
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
export const CartCard = ({商品GUID, 消費者GUID, amount, index}) => {
  
    const [stockData, setStockData] = useState({});
    const fetchStock = async function() {  
    try {
        fetch(`http://10.0.2.2:3101/getData/getStock?商品GUID=${商品GUID}`, {
            headers: { "Content-Type": "application/json" },
            method: 'GET'
        }).then((response) => {
            return response.json(); 
        }).then((jsonData) => {
            setStockData(jsonData)
        }).catch((err) => {
            console.log('錯誤:', err);
        })
    } catch (error) {
        console.error(error);
    } finally {
        //結束等待
    }
  }
  
  const deleteCart = async () => {
    let cartString = await AsyncStorage.getItem(`@happyStorage:cartOf${消費者GUID}`);
    let cart = (cartString == null)? {}: JSON.parse(cartString);
    delete cart[商品GUID];
    console.log(cart);
  }
    useEffect(() => {
        fetchStock();
    }, []);
  return (
        <View style={index%2==0? styles.container1: styles.container2}>
            <BlueSpacing10></BlueSpacing10>
            <Text style={{fontSize: 24}}>{stockData.商品名稱}</Text>
            <BlueSpacing20></BlueSpacing20>
            <Image
                    style={{width:'60%', height:180, borderRadius: 10}}
                    source={{uri: `http://10.0.2.2:3101/Images/stock/${stockData.商品圖片}`}}
                />
            <BlueSpacing20></BlueSpacing20>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '40%'}}>
                <BlueSpacing20></BlueSpacing20>
                <Text style={{ marginTop: 8,fontSize: 16}}>剩餘數量: {stockData.商品數量}</Text>
                <Text style={{fontSize: 16}}>價格(NTD): {stockData.商品價格}</Text>
              </View>
              <View style={{width: '40%'}}>
              <BlueSpacing10></BlueSpacing10>
              <Text>  數量: {amount}</Text>
                <BlueSpacing10></BlueSpacing10>
                <TouchableOpacity 
                  style={styles.button} 
                  accessibilityRole="button" 
                  onPress={()=>deleteCart()}>
                  <Text style={{fontSize: 16}}>移出購物車</Text>
                </TouchableOpacity>
              </View>
              
            </View>
            <BlueSpacing20></BlueSpacing20>
        </View>
    );
};

CartCard.propTypes = {
    商品GUID: PropTypes.string
};