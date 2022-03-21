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
    function endOrder(訂單GUID) {
        try {
            fetch('http://10.0.2.2:3101/order/endOrder', {
                headers: { "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify({
                    訂單GUID: 訂單GUID,
                })
            }).then((response) => {
                return response.json(); 
            }).then((jsonData) => {
                if(jsonData.message === 'End OK') {
                    console.log("重整畫面")
                    fetchOrderList();
                } else {
                    Alert.alert(
                        "錯誤",
                        "原因: " + jsonData.message
                    )
                }
            }).catch((err) => {
                console.log('錯誤:', err);
            })
        } catch (error) {
            console.error(error);
        } finally {
        }
    }
    const renderUserOrderCard = ({item, index}) => {
        let detail ="\n";
        //console.log(item);
        for (const stock of item.訂單內容) {
            detail = detail + `買了 ${stock.amount} 份 ${stock.商品名稱}(單價${stock.商品價格}元) \n`
        }
        let status, needToPay, payLnd, ethHash, IPFSHash, deliverer;
        if(item.訂單狀態 == "待確認")
            status = "尚未確認此訂單";
        else if(item.訂單狀態 == "待付款") {
            status = "待付款";
            needToPay = true;
            payLnd = item.訂單付款lnd;
            item.toIPFS = `付款人: ${userData.消費者GUID}\n收款人: ${item.訂單攤商GUID}\n細節:\n${detail}`;
            //console.log(item.toIPFS)
        }
        else if(item.訂單狀態 == "已付款"){
            status = "等待配送中";
            ethHash = item.訂單EthHash;
            IPFSHash = item.訂單IPFSHash;
            deliverer = item.訂單外送員GUID;
        }
        else if(item.訂單狀態 == "已完成"){
            status = "交易完成";
        }
            
        return (
            <View>
                <View style={index%2==0? styles.container1: styles.container2}>
                    <Text>訂單ID: {item.訂單GUID}</Text>

                    <View style={{width:'90%'}}>
                        <Text style={{fontSize: 20}}>{detail}</Text>
                    </View>
                    <Text style={{fontSize: 24}}>{status}</Text>
                    {needToPay &&
                    <TouchableOpacity style={styles.button} accessibilityRole="button" onPress={()=>payInvoice(item)}>
                        <Text style={{fontSize: 24}}>前往付款</Text>
                    </TouchableOpacity>
                    }
                    <BlueSpacing20/>
                    {IPFSHash &&
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#CAFFD4'}]} onPress={() => ViewIPFS(IPFSHash)}>
                        <View ><Text style={styles.text}>在瀏覽器中檢視IPFS收據 </Text>
                        </View>
                      </TouchableOpacity>
                    }
                    {ethHash && 
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#CAFFD4'}]} onPress={() => ViewEth(ethHash)}>
                        <View ><Text style={styles.text}>在以太坊區塊鏈中查看合約 </Text>
                        </View>
                        </TouchableOpacity>
                    }
                    {deliverer && 
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#68FF84'}]} onPress={() => endOrder(item.訂單GUID)}>
                        <View ><Text style={[styles.text, {fontSize:24}]}>確認到貨</Text>
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
    const switchDeliverer = async (訂單GUID, 訂單攤商GUID) =>{
        try {
            fetch('http://10.0.2.2:3101/order/switchDeliverer', {
                headers: { "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify({
                    訂單GUID: 訂單GUID,
                    訂單外送員GUID: 訂單攤商GUID,
                })
            }).then((response) => {
                return response.json(); 
            }).then((jsonData) => {
                if(jsonData.message === 'Switch OK') {
                    console.log("重整畫面")
                    fetchOrderList();
                } else {
                    Alert.alert(
                        "錯誤",
                        "原因: " + jsonData.message
                    )
                }
            }).catch((err) => {
                console.log('錯誤:', err);
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
        for (const stock of item.訂單內容) {
            detail = detail + `買了 ${stock.amount} 份 ${stock.商品名稱}(單價${stock.商品價格}元) \n`
            price += stock.amount * stock.商品價格;
        }
        item["price"] = price;

        let status, needToConfirm, payLnd, ethHash, IPFSHash, deliverer;
        if(item.訂單狀態 == "待確認") {
            status = "尚未確認此訂單";
            needToConfirm = true;
            deliverer = item.訂單外送員GUID;
        }
        else if(item.訂單狀態 == "待付款") {
            status = "等待付款中...";
            payLnd = item.訂單付款lnd;
        }
        else if(item.訂單狀態 == "已付款"){
            status = "等待配送中";
            ethHash = item.訂單EthHash;
            ethHash = item.訂單IPFSHash;
            deliverer = item.訂單外送員GUID
        } 
        else if(item.訂單狀態 == "已完成"){
            status = "交易完成";
        }
        return (
            <View>
                <View style={index%2==0? styles.container1: styles.container2}>
                    <Text>訂單ID: {item.訂單GUID}</Text>
                    <View style={{width:'90%'}}>
                        <Text style={{fontSize: 20}}>{detail}</Text>
                    </View>
                    <Text style={{fontSize: 24}}>總價: {price}元</Text>
                    <Text style={{fontSize: 24}}>{status}</Text>
                    {item.訂單狀態 == "待確認" ?//只有待確認可以變更外送方式
                    <View>
                        <BlueSpacing20></BlueSpacing20>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#B1FF7F'}]} accessibilityRole="button" onPress={()=>switchDeliverer(item.訂單GUID, deliverer)}>
                        <Text style={{fontSize: 20}}>{deliverer}(輕按切換)</Text>
                        </TouchableOpacity>
                    </View>:
                    <View>
                        <Text style={{fontSize: 20}}>{deliverer}</Text>
                    </View>
                    }
                    {needToConfirm &&
                    <TouchableOpacity style={styles.button} accessibilityRole="button" onPress={()=>sendOrderInvoice(item)}>
                        <Text style={{fontSize: 24}}>確認訂單，開始創建付款支票</Text>
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
        console.log('尋找訂單紀錄...');
        let fetchURL;
        if(loginType == "user")
            fetchURL = `http://10.0.2.2:3101/getData/getOrderRecord?type=user&消費者GUID=${userData.消費者GUID}`
        else
            fetchURL = `http://10.0.2.2:3101/getData/getOrderRecord?type=merchant&攤商GUID=${userData.攤商GUID}`
        let orderL = [];
        let records = fetch(fetchURL, {
            headers: { "Content-Type": "application/json" },
            method: 'GET'
        }).then((response) => {
            return response.json(); 
        }).then((jsonData) => {
            jsonData.forEach(element => {
                element.訂單內容 = JSON.parse(element.訂單內容)
                //console.log("找到訂單列表");
            });
            orderL = jsonData;
        }).catch((err) => {
            console.log('錯誤:', err); 
        })

        
        records.then(() => {
            //console.log("orderL.length: ", orderL.length)
            var fetches = [];
            orderL.forEach(element => {
                let detail = element.訂單內容;
                //console.log("訂單GUID",element.訂單GUID)
                
                detail.forEach(stock => {
                    let 商品GUID = stock.商品GUID;
                    fetches.push(
                        fetch(`http://10.0.2.2:3101/getData/getStock?商品GUID=${商品GUID}`, {
                            headers: { "Content-Type": "application/json" },
                            method: 'GET'
                        }).then((response) => {
                            return response.json(); 
                        }).then((stockData) => {
                            //console.log(stockData.商品名稱)
                            stock.商品價格 = stockData.商品價格;
                            stock.商品名稱 = stockData.商品名稱;
                        }).catch((err) => {
                            console.log('錯誤:', err); 
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
        //取得訂單紀錄
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
                        keyExtractor={訂單 => 訂單.訂單GUID}
                        listKey={訂單 => 訂單.訂單GUID}
                    /> 
                }
                {haveOrder && loginType =="merchant" &&
                    <FlatList
                        style={{width: '90%',}}
                        data={orderList}
                        renderItem={renderMerchantOrderCard}
                        keyExtractor={訂單 => 訂單.訂單GUID}
                        listKey={訂單 => 訂單.訂單GUID}
                    /> 
                }
                {!haveOrder? <Text style={{fontSize: 36}}>尚無紀錄</Text>:<></>}
            </View>
        </SafeBlueArea>
            
    )
}

RecordPage.navigationOptions = () => ({
    ...BlueNavigationStyle(),
    title: 'BlueWallet',
});

export default RecordPage;