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

import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


/** @type {AppStorage} */

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container:{
        //backgroundColor: 'aqua',
        alignItems: 'center',
    },
    container1: {
        flex: 1,
        backgroundColor: '#FFFACA',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
      },
    container2: {
        flex: 1,
        backgroundColor: '#CAF5FF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    button: {
        backgroundColor: '#AADAE9',
        borderRadius: 20,
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


const DelivererPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const {delivererGUID, userData} = useRoute().params;
    const [orderList, setOrderList] = useState({});
    const [haveOrder, setHaveOrder] = useState(false);
    const renderDelivererOrderCard = ({item, index}) => {
        let detail ="\n";
        return (
            <View >
                <View style={index%2==0? styles.container1: styles.container2}>
                    <Text>訂單ID: {item.訂單GUID}</Text>

                    <BlueSpacing20/>
                    <TouchableOpacity style={[styles.button, {backgroundColor: '#68FF84'}]} onPress={() => endOrder(item.訂單GUID)}>
                    <View ><Text style={[styles.text, {fontSize:24}]}>接單</Text>
                    </View>
                    </TouchableOpacity>
                </View> 
                <BlueSpacing20/>
            </View>
        )
    };

    const fetchOrderList = async function() {
        console.log('尋找能接的單...');
        let fetchURL;
        fetchURL = `http://10.0.2.2:3101/getData/getOrderRecord?type=deliverer`

        let orderL = [];
        let records = fetch(fetchURL, {
            headers: { "Content-Type": "application/json" },
            method: 'GET'
        }).then((response) => {
            return response.json(); 
        }).then((jsonData) => {
            console.log(jsonData);
            orderL = jsonData;
            setOrderList(orderL);
        }).catch((err) => {
            console.log('錯誤:', err); 
        })

        
    } 
    useEffect(() => {
        //取得訂單清單
        fetchOrderList();
        setIsLoading(false);
    }, []);
    return isLoading ? (
        <BlueLoading />
    ) : (
        
        <SafeBlueArea forceInset={{ horizontal: 'always' }} style={styles.root}>
            <View style={styles.container}>
                <Text  style={{fontSize: 36}}>
                        外送員 {userData.外送員名稱}，您好
                </Text>
                <Text  style={{fontSize: 24}}>
                        訂單列表
                </Text>
            </View>
            <BlueSpacing10/>
            <View style={ { flex: 1, alignItems:'center'}}>
                {orderList[0] && 
                    <FlatList
                        style={{width: '80%',}}
                        data={orderList}
                        renderItem={renderDelivererOrderCard}
                        keyExtractor={商品 => 商品.商品GUID}
                    />
                }
            </View>
        </SafeBlueArea>
        
    )
}

DelivererPage.navigationOptions = () => ({
    ...BlueNavigationStyle(),
    title: 'BlueWallet',
});

export default DelivererPage;