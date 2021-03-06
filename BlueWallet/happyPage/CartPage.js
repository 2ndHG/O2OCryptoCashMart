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
            //console.log(??????GUID);
            let cartString = await AsyncStorage.getItem(`@happyStorage:cartOf${userData.?????????GUID}`);
            //console.log('cartString', cartString);
            let cart = (cartString == null)? {}: JSON.parse(cartString);
            //console.log('cart1', cart);
            delete cart[merchantGUID];
            //console.log('cart2', cart);
            await AsyncStorage.setItem(
                `@happyStorage:cartOf${userData.?????????GUID}`,
                JSON.stringify(cart)
            )
            await getMerchantList();
        }
        catch {

        }
    }
    const pay = async (?????????, ?????????GUID, ??????GUID) => {
        console.log("????????????")
        try {
            fetch('http://10.0.2.2:3101/order/sendOrder', {
                headers: { "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify({
                    ?????????GUID: ?????????GUID,
                    ??????GUID, ??????GUID,
                    ?????????: ?????????
                })
            }).then((response) => {
                return response.json(); 
            }).then((jsonData) => {
                if(jsonData.message == 'OK')
                {
                    Alert.alert("???????????????????????????????????????");
                    removeCart(??????GUID);
                }
                    
            }).catch((err) => {
                console.log('??????:', err);
            })
        } catch (error) {
            console.error(error);
        } finally {
        }

    }
    const renderMerchant = ({item, index}) => {
        let cartArray = [];
        for (const ??????GUID in cartList[item]) {
            if (Object.hasOwnProperty.call(cartList[item], ??????GUID)) {
                const amount = cartList[item][??????GUID];
                cartArray.push({amount: amount, ??????GUID: ??????GUID})
            }
        }
        let bColor =  index%2? '#6EBF9F':'#AADAE9';

        return (
            <View style={{backgroundColor: index%2? '#DDFFDA': '#DAFFFA', width: '100%' , alignItems: 'center'}}>
                <View style={{width: '90%'}}>
                    <Text style={{fontSize:16}}>?????????GUID: {item}</Text>
                    {cartArray && 
                    <FlatList
                        style={{width: '100%'}}
                        data={cartArray}
                        renderItem={renderCartCard}
                        keyExtractor={?????? => ??????.??????GUID}
                        listKey={?????? => ??????.??????GUID}
                    />} 
                    <BlueSpacing20/>
                    <TouchableOpacity style={[styles.button, {backgroundColor: bColor}]} accessibilityRole="button" onPress={() => pay(cartArray, userData.?????????GUID, item)} >
                        <Text style={{fontSize: 24}}>????????????</Text>
                    </TouchableOpacity>
                </View> 
            </View>
        )
    } 
    
    const renderCartCard = ({item, index}) => {
        //console.log('??????GUID', item.??????GUID)
        return (
        <View>
            <CartCard 
                ??????GUID={item.??????GUID}
                ?????????GUID={userData.?????????GUID}
                amount={item.amount}
                index={index}
            >
            </CartCard>
            <BlueSpacing20></BlueSpacing20>
        </View> 
    )};
    const getMerchantList = async () => {
        console.log("??????????????????????????????")
        let cartString = await AsyncStorage.getItem(`@happyStorage:cartOf${userData.?????????GUID}`);
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
        //console.log('????????????', mArray);
    }  
    useEffect(() => {
        const getMerchantList = async () => {
            console.log("??????????????????????????????...")
            let cartString = await AsyncStorage.getItem(`@happyStorage:cartOf${userData.?????????GUID}`);
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
            //console.log('????????????', mArray);
        }  
        //??????????????????
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
                        keyExtractor={?????? => ??????.??????GUID}
                        listKey={(??????) => ??????.??????GUID}
                    />
                }
                {!haveItemInCart? <Text style={{fontSize: 36}}>???????????????????????????</Text>:<></>}
            </View>
        </SafeBlueArea>
            
    )
}

CartPage.navigationOptions = () => ({
    ...BlueNavigationStyle(),
    title: 'BlueWallet',
});

export default CartPage;