import React, { useState, useEffect,Component} from 'react';
import { FlatList, ScrollView, StyleSheet, TextInput, Alert, ImageBackground, View, Image, Text, Touchable } from 'react-native';
import { useNavigation, useTheme, useRoute } from '@react-navigation/native';
import { BlueLoading, SafeBlueArea, BlueCard, BlueText, BlueNavigationStyle, BlueSpacing20, BlueListItem, BlueSpacing10, BlueSpacing40 } from '../BlueComponents';
import ImagePicker from 'react-native-image-picker'
import { isCanonicalScriptSignature } from 'bitcoinjs-lib/types/script';
import { Icon } from 'react-native-elements';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { Dimensions } from 'react-native';
import { exp } from 'react-native-reanimated';


import { StockCard } from '../happyComponents/StockCard';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../NavigationService';


/** @type {AppStorage} */

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container:{
        flex:3,
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
    },
    container02: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
    },
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


const MyShopPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [stockList, setStockList] = useState({});
    const {userData} = useRoute().params;
    
    const fetchStockList = async function() {  
        try {
            console.log('??????????????????...');
            fetch(`http://10.0.2.2:3101/getData/getStockList???????GUID=${userData.??????GUID}`, {
                headers: { "Content-Type": "application/json" },
                method: 'GET'
            }).then((response) => {
                return response.json(); 
            }).then((jsonData) => {
                setStockList(jsonData)
                //console.log('??????????????????', jsonData);
            }).catch((err) => {
                console.log('??????:', err);
            })
        } catch (error) {
            console.error(error);
        } finally {
            //????????????
        }
    }
    const updateStockInvoice = (item) => {
        navigate('WalletsList',{
            userData: userData,
            //loginType: loginType,
            changingStock: true,
            stock: item
        })
    }
    const unsellStock = (stockGUID) => {
        console.log("?????????????????????: ", stockGUID)
    }
    const updateInvoice = async (payment_request) => {
        try {
          console.log('????????????????????????...');
          fetch('http://10.0.2.2:3101/uploadData/updateInvoice', {
                    headers: { "Content-Type": "application/json" },
                    method: 'POST',
                    body: JSON.stringify({
                        ??????GUID: stock.??????GUID,
                        ????????????: payment_request,
                    })
                }).then((response) => {
                    return response.json(); 
                }).then((jsonData) => {
                    console.log(jsonData)
                }).catch((err) => {
                    console.log('??????:', err);
                })
      } catch (error) {
          console.error(error);
      } finally {
          //????????????
      }
    }
    const renderStockCard = ({item, index}) => {
        //console.log(item);
        return (
        <View style={index%2==0? styles.container1: styles.container2}>
            <BlueSpacing10></BlueSpacing10>
            <Text style={{fontSize: 24}}>{item.????????????}</Text>
            <BlueSpacing20></BlueSpacing20>
            <Image
                    style={{width:'60%', height:180, borderRadius: 10}}
                    source={{uri: `http://10.0.2.2:3101/Images/stock/${item.????????????}`}}
                />
            <BlueSpacing20></BlueSpacing20>
            
            <View style={styles.intro}>
              <View style={{width:'90%', marginTop: 5}}>
                <Text style={{fontSize: 16}}>{item.????????????}</Text>
              </View>
            </View>
            <BlueSpacing40></BlueSpacing40>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '40%'}}>
                <Text style={{ marginTop: 8,fontSize: 16}}>????????????: {item.????????????}</Text>
                <Text style={{fontSize: 16}}>??????(NTD): {item.????????????}</Text>
              </View>
              <View style={{width: '40%'}}>
              <BlueSpacing10></BlueSpacing10>
                <TouchableOpacity 
                  style={styles.button} 
                  accessibilityRole="button" 
                  onPress={() => unsellStock(item.??????GUID)}>
                  <Text style={{fontSize: 16}}>??????</Text>
                </TouchableOpacity>
              </View>
              
            </View>
            <BlueSpacing20></BlueSpacing20>
            <BlueSpacing20></BlueSpacing20>
        </View> 
    )};
    useEffect(() => {
        //??????????????????
        fetchStockList();
        setIsLoading(false);
    }, []);
    return isLoading ? (
        <BlueLoading />
    ) : (
        <SafeBlueArea forceInset={{ horizontal: 'always' }} style={styles.root}>
            <View style={ { flex: 1, alignItems:'center'}}>
                {stockList[0] && 
                    <FlatList
                        style={{width: '80%',}}
                        data={stockList}
                        renderItem={renderStockCard}
                        keyExtractor={?????? => ??????.??????GUID}
                    />
                }
            </View>
            {
            /*
            <TouchableOpacity onPress={()=>updateInvoice('12345678')}>
                <Text>??????????????????</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>addToCart('stock9897', 10, 'test')}>
                <Text>??????local storage</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>getCartList()}>
                <Text>??????local storage??????</Text>
            </TouchableOpacity>
            */
            }
        </SafeBlueArea>
            
    )
}

MyShopPage.navigationOptions = () => ({
    ...BlueNavigationStyle(),
    title: 'BlueWallet',
});

export default MyShopPage;