import React, { useState, useEffect,Component} from 'react';
import { FlatList, ScrollView, StyleSheet, TextInput, Alert, ImageBackground, View, Image, Text, Touchable, Linking } from 'react-native';
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
    checkbox: {
        alignSelf: "center",
    },
});
const RecordPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [orderList, setOrderList] = useState({});
    const {merchantGUID, userData, loginType} = useRoute().params;
    const [haveOrder, setHaveOrder] = useState(false);
    const { navigate, reset, goBack } = useNavigation();
 
    const ViewIPFS = async (IPFSHash) => {
        let url = "https://ipfs.io/ipfs/"+IPFSHash;
        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL(url);
    
        if (supported) {
          // Opening the link with some app, if the URL scheme is "http" the web link should be opened
          // by some browser in the mobile
          await Linking.openURL(url);
        } else {
          Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    }
    const ViewEth = async (ethHash) => {
        let url = "https://rinkeby.etherscan.io/tx/"+ethHash;
        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL(url);
    
        if (supported) {
          // Opening the link with some app, if the URL scheme is "http" the web link should be opened
          // by some browser in the mobile
          await Linking.openURL(url);
        } else {
          Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    }
    function endOrder(??????GUID) {
        try {
            fetch('http://10.0.2.2:3101/order/endOrder', {
                headers: { "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify({
                    ??????GUID: ??????GUID,
                })
            }).then((response) => {
                return response.json(); 
            }).then((jsonData) => {
                if(jsonData.message === 'End OK') {
                    console.log("????????????")
                    fetchOrderList();
                } else {
                    Alert.alert(
                        "??????",
                        "??????: " + jsonData.message
                    )
                }
            }).catch((err) => {
                console.log('??????:', err);
            })
        } catch (error) {
            console.error(error);
        } finally {
        }
    }
    const renderUserOrderCard = ({item, index}) => {
        let detail ="\n";
        //console.log(item);
        for (const stock of item.????????????) {
            detail = detail + `?????? ${stock.amount} ??? ${stock.????????????}(??????${stock.????????????}???) \n`
        }
        let status, needToPay, payLnd, ethHash, IPFSHash, deliverer;
        if(item.???????????? == "?????????")
            status = "?????????????????????";
        else if(item.???????????? == "?????????") {
            status = "?????????";
            needToPay = true;
            payLnd = item.????????????lnd;
            item.toIPFS = `?????????: ${userData.?????????GUID}\n?????????: ${item.????????????GUID}\n??????:\n${detail}`;
            //console.log(item.toIPFS)
        }
        else if(item.???????????? == "?????????"){
            status = "???????????????";
            ethHash = item.??????EthHash;
            IPFSHash = item.??????IPFSHash;
            deliverer = item.???????????????GUID;
        }
        else if(item.???????????? == "?????????"){
            status = "????????????";
        }
            
        return (
            <View>
                <View style={index%2==0? styles.container1: styles.container2}>
                    <Text>??????ID: {item.??????GUID}</Text>

                    <View style={{width:'90%'}}>
                        <Text style={{fontSize: 20}}>{detail}</Text>
                    </View>
                    <Text style={{fontSize: 24}}>{status}</Text>
                    {needToPay &&
                    <TouchableOpacity style={styles.button} accessibilityRole="button" onPress={()=>payInvoice(item)}>
                        <Text style={{fontSize: 24}}>????????????</Text>
                    </TouchableOpacity>
                    }
                    <BlueSpacing20/>
                    {IPFSHash &&
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#CAFFD4'}]} onPress={() => ViewIPFS(IPFSHash)}>
                        <View ><Text style={styles.text}>?????????????????????IPFS?????? </Text>
                        </View>
                      </TouchableOpacity>
                    }
                    {ethHash && 
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#CAFFD4'}]} onPress={() => ViewEth(ethHash)}>
                        <View ><Text style={styles.text}>???????????????????????????????????? </Text>
                        </View>
                        </TouchableOpacity>
                    }
                    {deliverer && 
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#68FF84'}]} onPress={() => endOrder(item.??????GUID)}>
                        <View ><Text style={[styles.text, {fontSize:24}]}>????????????</Text>
                        </View>
                        </TouchableOpacity>
                    }
                </View> 
                <BlueSpacing40/>
            </View>
        )
    };
    const payInvoice = (order) => {
        navigate('WalletsList',{
            userData: userData,
            //loginType: loginType,
            payingInvoice: true,
            order: order
        })
    }
    const switchDeliverer = async (??????GUID, ????????????GUID) =>{
        try {
            fetch('http://10.0.2.2:3101/order/switchDeliverer', {
                headers: { "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify({
                    ??????GUID: ??????GUID,
                    ???????????????GUID: ????????????GUID,
                })
            }).then((response) => {
                return response.json(); 
            }).then((jsonData) => {
                if(jsonData.message === 'Switch OK') {
                    console.log("????????????")
                    fetchOrderList();
                } else {
                    Alert.alert(
                        "??????",
                        "??????: " + jsonData.message
                    )
                }
            }).catch((err) => {
                console.log('??????:', err);
            })
        } catch (error) {
            console.error(error);
        } finally {
        }
    }
    const renderMerchantOrderCard = ({item, index}) => {
        let detail ="\n";
        let price=0;
        //console.log(item);
        for (const stock of item.????????????) {
            detail = detail + `?????? ${stock.amount} ??? ${stock.????????????}(??????${stock.????????????}???) \n`
            price += stock.amount * stock.????????????;
        }
        item["price"] = price;

        let status, needToConfirm, payLnd, ethHash, IPFSHash, deliverer;
        if(item.???????????? == "?????????") {
            status = "?????????????????????";
            needToConfirm = true;
            deliverer = item.???????????????GUID;
        }
        else if(item.???????????? == "?????????") {
            status = "???????????????...";
            payLnd = item.????????????lnd;
        }
        else if(item.???????????? == "?????????"){
            status = "???????????????";
            ethHash = item.??????EthHash;
            ethHash = item.??????IPFSHash;
            deliverer = item.???????????????GUID
        } 
        else if(item.???????????? == "?????????"){
            status = "????????????";
        }
        return (
            <View>
                <View style={index%2==0? styles.container1: styles.container2}>
                    <Text>??????ID: {item.??????GUID}</Text>
                    <View style={{width:'90%'}}>
                        <Text style={{fontSize: 20}}>{detail}</Text>
                    </View>
                    <Text style={{fontSize: 24}}>??????: {price}???</Text>
                    <Text style={{fontSize: 24}}>{status}</Text>
                    {item.???????????? == "?????????" ?//???????????????????????????????????????
                    <View>
                        <BlueSpacing20></BlueSpacing20>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#B1FF7F'}]} accessibilityRole="button" onPress={()=>switchDeliverer(item.??????GUID, deliverer)}>
                        <Text style={{fontSize: 20}}>{deliverer}(????????????)</Text>
                        </TouchableOpacity>
                    </View>:
                    <View>
                        <Text style={{fontSize: 20}}>{deliverer}</Text>
                    </View>
                    }
                    {needToConfirm &&
                    <TouchableOpacity style={styles.button} accessibilityRole="button" onPress={()=>sendOrderInvoice(item)}>
                        <Text style={{fontSize: 24}}>???????????????????????????????????????</Text>
                    </TouchableOpacity>
                    }
                    
                </View> 
                <BlueSpacing40/>
            </View>
        )
    };
    const sendOrderInvoice = (order) => {
        navigate('WalletsList',{
            userData: userData,
            //loginType: loginType,
            creatingInvoice: true,
            order: order
        })
    }
    const fetchOrderList = async function() {
        console.log('??????????????????...');
        let fetchURL;
        if(loginType == "user")
            fetchURL = `http://10.0.2.2:3101/getData/getOrderRecord?type=user&?????????GUID=${userData.?????????GUID}`
        else
            fetchURL = `http://10.0.2.2:3101/getData/getOrderRecord?type=merchant&??????GUID=${userData.??????GUID}`
        let orderL = [];
        let records = fetch(fetchURL, {
            headers: { "Content-Type": "application/json" },
            method: 'GET'
        }).then((response) => {
            return response.json(); 
        }).then((jsonData) => {
            jsonData.forEach(element => {
                element.???????????? = JSON.parse(element.????????????)
                //console.log("??????????????????");
            });
            orderL = jsonData;
        }).catch((err) => {
            console.log('??????:', err); 
        })

        
        records.then(() => {
            //console.log("orderL.length: ", orderL.length)
            var fetches = [];
            orderL.forEach(element => {
                let detail = element.????????????;
                //console.log("??????GUID",element.??????GUID)
                
                detail.forEach(stock => {
                    let ??????GUID = stock.??????GUID;
                    fetches.push(
                        fetch(`http://10.0.2.2:3101/getData/getStock???????GUID=${??????GUID}`, {
                            headers: { "Content-Type": "application/json" },
                            method: 'GET'
                        }).then((response) => {
                            return response.json(); 
                        }).then((stockData) => {
                            //console.log(stockData.????????????)
                            stock.???????????? = stockData.????????????;
                            stock.???????????? = stockData.????????????;
                        }).catch((err) => {
                            console.log('??????:', err); 
                        })
                    )
                });
                
            });
            Promise.all(fetches).then(() => {
                console.log (orderL);
                setOrderList(orderL);
                setHaveOrder(true)
            });
        })
    } 
    useEffect(() => {
        //??????????????????
        fetchOrderList();
        
        setIsLoading(false);
    }, []);
    return isLoading ? (
        <BlueLoading />
    ) : (
        <SafeBlueArea forceInset={{ horizontal: 'always' }} style={styles.root}>

            <View style={ { flex: 1, alignItems:'center'}}>
                {haveOrder && loginType =="user" &&
                    <FlatList
                        style={{width: '90%',}}
                        data={orderList}
                        renderItem={renderUserOrderCard}
                        keyExtractor={?????? => ??????.??????GUID}
                        listKey={?????? => ??????.??????GUID}
                    /> 
                }
                {haveOrder && loginType =="merchant" &&
                    <FlatList
                        style={{width: '90%',}}
                        data={orderList}
                        renderItem={renderMerchantOrderCard}
                        keyExtractor={?????? => ??????.??????GUID}
                        listKey={?????? => ??????.??????GUID}
                    /> 
                }
                {!haveOrder? <Text style={{fontSize: 36}}>????????????</Text>:<></>}
            </View>
        </SafeBlueArea>
            
    )
}

RecordPage.navigationOptions = () => ({
    ...BlueNavigationStyle(),
    title: 'BlueWallet',
});

export default RecordPage;