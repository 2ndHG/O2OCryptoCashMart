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


import { CartCard } from '../happyComponents/CartCard';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


/** @type {AppStorage} */

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'pink'
    },
    container02: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
    },
    button: {
        //backgroundColor: '#AADAE9',
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

const CartPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [cartList, setCartList] = useState({});
    const [merchantArray, setMerchantArray] = useState([]);
    const {merchantGUID, userData} = useRoute().params;
    const [haveItemInCart, setHaveItemInCart] = useState(false);
    const { navigate, reset, goBack } = useNavigation();
    
    const removeCart = async (merchantGUID) => {
        try {
            //console.log(商品GUID);
            let cartString = await AsyncStorage.getItem(`@happyStorage:cartOf${userData.消費者GUID}`);
            //console.log('cartString', cartString);
            let cart = (cartString == null)? {}: JSON.parse(cartString);
            //console.log('cart1', cart);
            delete cart[merchantGUID];
            //console.log('cart2', cart);
            await AsyncStorage.setItem(
                `@happyStorage:cartOf${userData.消費者GUID}`,
                JSON.stringify(cart)
            )
            await getMerchantList();
        }
        catch {

        }
    }
    const pay = async (購物車, 消費者GUID, 攤商GUID) => {
        console.log("前往下訂")
        try {
            fetch('http://10.0.2.2:3101/order/sendOrder', {
                headers: { "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify({
                    消費者GUID: 消費者GUID,
                    攤商GUID, 攤商GUID,
                    購物車: 購物車
                })
            }).then((response) => {
                return response.json(); 
            }).then((jsonData) => {
                if(jsonData.message == 'OK')
                {
                    Alert.alert("下訂成功，請至我的訂單觀看");
                    removeCart(攤商GUID);
                }
                    
            }).catch((err) => {
                console.log('錯誤:', err);
            })
        } catch (error) {
            console.error(error);
        } finally {
        }

    }
    const renderMerchant = ({item, index}) => {
        let cartArray = [];
        for (const 商品GUID in cartList[item]) {
            if (Object.hasOwnProperty.call(cartList[item], 商品GUID)) {
                const amount = cartList[item][商品GUID];
                cartArray.push({amount: amount, 商品GUID: 商品GUID})
            }
        }
        let bColor =  index%2? '#6EBF9F':'#AADAE9';

        return (
            <View style={{backgroundColor: index%2? '#DDFFDA': '#DAFFFA', width: '100%' , alignItems: 'center'}}>
                <View style={{width: '90%'}}>
                    <Text style={{fontSize:16}}>此攤商GUID: {item}</Text>
                    {cartArray && 
                    <FlatList
                        style={{width: '100%'}}
                        data={cartArray}
                        renderItem={renderCartCard}
                        keyExtractor={商品 => 商品.商品GUID}
                        listKey={商品 => 商品.商品GUID}
                    />} 
                    <BlueSpacing20/>
                    <TouchableOpacity style={[styles.button, {backgroundColor: bColor}]} accessibilityRole="button" onPress={() => pay(cartArray, userData.消費者GUID, item)} >
                        <Text style={{fontSize: 24}}>送出訂單</Text>
                    </TouchableOpacity>
                </View> 
            </View>
        )
    } 
    
    const renderCartCard = ({item, index}) => {
        //console.log('商品GUID', item.商品GUID)
        return (
        <View>
            <CartCard 
                商品GUID={item.商品GUID}
                消費者GUID={userData.消費者GUID}
                amount={item.amount}
                index={index}
            >
            </CartCard>
            <BlueSpacing20></BlueSpacing20>
        </View> 
    )};
    const getMerchantList = async () => {
        console.log("尋找購物車中的攤商們")
        let cartString = await AsyncStorage.getItem(`@happyStorage:cartOf${userData.消費者GUID}`);
        //console.log('cartString', JSON.parse(cartString));
        let cartList = JSON.parse(cartString)
        setCartList(cartList);
        //console.log('123');
        let mArray = [];
        //setHaveItemInCart(false);
        for (const m in cartList) {
            if (Object.hasOwnProperty.call(cartList, m)) {
                mArray.push(m)
            }
            //setHaveItemInCart(true);
        }
        setMerchantArray([...mArray]);
        //console.log('攤商列表', mArray);
    }  
    useEffect(() => {
        const getMerchantList = async () => {
            console.log("尋找購物車中的攤商們...")
            let cartString = await AsyncStorage.getItem(`@happyStorage:cartOf${userData.消費者GUID}`);
            //console.log('cartString', JSON.parse(cartString));
            let cartList = JSON.parse(cartString)
            setCartList(cartList);
            //console.log('123');
            let mArray = [];
            setHaveItemInCart(false);
            for (const m in cartList) {
                if (Object.hasOwnProperty.call(cartList, m)) {
                    //const merchant = cartList[m];
                    mArray.push(m)
                }
                setHaveItemInCart(true);
            }
            setMerchantArray([...mArray]);
            //console.log('攤商列表', mArray);
        }  
        //取得商品清單
        getMerchantList();
        setIsLoading(false);
    }, []);
    return isLoading ? (
        <BlueLoading />
    ) : (
        <SafeBlueArea forceInset={{ horizontal: 'always' }} style={styles.root}>

            <View style={ { flex: 1, alignItems:'center'}}>
                {merchantArray[0] && 
                    <FlatList
                        style={{width: '100%'}}
                        data={merchantArray}
                        renderItem={renderMerchant}
                        keyExtractor={攤商 => 攤商.攤商GUID}
                        listKey={(攤商) => 攤商.攤商GUID}
                    />
                }
                {!haveItemInCart? <Text style={{fontSize: 36}}>購物車裡什麼都沒有</Text>:<></>}
            </View>
        </SafeBlueArea>
            
    )
}

CartPage.navigationOptions = () => ({
    ...BlueNavigationStyle(),
    title: 'BlueWallet',
});

export default CartPage;