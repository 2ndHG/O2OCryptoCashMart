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
    }
});


const ShopPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [stockList, setStockList] = useState({});
    const {merchantGUID, userData} = useRoute().params;
    
    const fetchStockList = async function() {  
        try {
            console.log('尋找攤商資料...');
            fetch(`http://10.0.2.2:3101/getData/getStockList?攤商GUID=${merchantGUID}`, {
                headers: { "Content-Type": "application/json" },
                method: 'GET'
            }).then((response) => {
                return response.json(); 
            }).then((jsonData) => {
                setStockList(jsonData)
                //console.log('找到商品資料', jsonData);
            }).catch((err) => {
                console.log('錯誤:', err);
            })
        } catch (error) {
            console.error(error);
        } finally {
            //結束等待
        }
    }
    const addToCart = async (商品GUID, 數量, 消費者GUID) => {
        try {
            //console.log(商品GUID);
            let cartString = await AsyncStorage.getItem(`@happyStorage:cartOf${消費者GUID}`);
            //console.log('cartString', cartString);
            let cart = (cartString == null)? {}: JSON.parse(cartString);
            if(cart[merchantGUID] == undefined) {
                cart[merchantGUID] = {};
            }
            
            if(cart[merchantGUID][商品GUID] == undefined) {
                cart[merchantGUID][商品GUID] = 數量;
            } else {
                cart[merchantGUID][商品GUID] += 數量;
                console.log('已加上數量: ', 數量)
            }
            console.log('cart', cart);
            await AsyncStorage.setItem(
                `@happyStorage:cartOf${消費者GUID}`,
                JSON.stringify(cart)
            )
        }
        catch {

        }
    }
    const getCartList = async () => {
        let cartString = await AsyncStorage.getItem(`@happyStorage:cartOf${userData.消費者GUID}`);
        const cartList = JSON.parse(cartString);
        for (const m in cartList) {
            console.log(m);
            if (Object.hasOwnProperty.call(cartList, m)) {
                const merchant = cartList[m];
                for (const s in merchant) {
                    if (Object.hasOwnProperty.call(merchant, s)) {
                        //const stock = merchant[stock];
                        console.log( s, ' ', merchant[s], '個')
                    }0
                }
            }
        }
    }
    
    const renderStockCard = ({item, index}) => {
        //console.log({addToCart, 消費者GUID: userData.消費者GUID, 商品GUID:item.商品GUID});
        return (
        <View>
            <StockCard 
                onPress={{addToCart, 消費者GUID: userData.消費者GUID, 商品GUID:item.商品GUID}}
                商品名稱={item.商品名稱} 
                商品圖片={item.商品圖片}
                商品介紹={item.商品介紹}
                商品數量={item.商品數量}
                商品價格={item.商品價格}
                index={index}
            >
            </StockCard>
            <BlueSpacing20></BlueSpacing20>
        </View> 
    )};
    useEffect(() => {
        //取得商品清單
        fetchStockList();
        setIsLoading(false);
    }, []);
    return isLoading ? (
        <BlueLoading />
    ) : (
        <SafeBlueArea forceInset={{ horizontal: 'always' }} style={styles.root}>
            <Text>
                這裡是商店頁面，{merchantGUID}
            </Text>
            <View style={ { flex: 1, alignItems:'center'}}>
                {stockList[0] && 
                    <FlatList
                        style={{width: '80%',}}
                        data={stockList}
                        renderItem={renderStockCard}
                        keyExtractor={商品 => 商品.商品GUID}
                    />
                }
            </View>
        </SafeBlueArea>
            
    )
}

ShopPage.navigationOptions = () => ({
    ...BlueNavigationStyle(),
    title: 'BlueWallet',
});

export default ShopPage;