import React, { useState, useEffect,Component} from 'react';
import { ScrollView, StyleSheet, TextInput, Alert, TouchableOpacity, ImageBackground, View, Image, Text } from 'react-native';
import { useNavigation, useTheme, useRoute } from '@react-navigation/native';
import { BlueLoading, SafeBlueArea, BlueCard, BlueText, BlueNavigationStyle, BlueSpacing20, BlueListItem, BlueSpacing10, BlueSpacing40 } from '../BlueComponents';


import { UserState } from 'realm';
import { LoginButton } from '../happyComponents/LoginButton';

//happy
//const IPFS = require('ipfs');

/** @type {AppStorage} */

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container:{
        //backgroundColor: 'aqua',
        alignItems: 'center',
    },
    container02: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
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
        width:'70%',
      },
    button2: {
        backgroundColor: '#E0BEF6',
        borderRadius: 20,
        padding: 10,
        marginBottom: 20,
        alignItems: 'center',
        width:'32%',
        margin: '3%',
        /*
        shadowColor: '#303838',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        shadowOpacity: 0.35,
        */
      },
});



//首頁
const HomePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { navigate } = useNavigation();
    //happy 使用者資料
    const {userData, loginType} = useRoute().params;
    const IPFS = require('ipfs-mini');
    const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

    const goToWallet = () => {
        navigate('WalletsList',{
            userData: userData,
            loginType: loginType
        })
    }
    const goToMerchantList = () => {
        navigate('MerchantListPage',{
            userData: userData,
            loginType: loginType
        })
    }
    const goToCart = () => {
        navigate('CartPage',{
            userData: userData,
            loginType: loginType
        })
    }
    const goToRecord = () => {
        navigate('RecordPage',{
            userData: userData,
            loginType: loginType
        })
    }
    //畫出使用者頁面
    const renderUserPage = () => {
        return (
            <View style={styles.container}>
                <Text style={{fontSize: 24}}>{userData.消費者名稱}，歡迎你來!</Text>
                <BlueSpacing20/>
                <Text style={{fontSize: 18}}>想做些什麼呢?</Text>
                <BlueSpacing20/>
                <TouchableOpacity onPress={goToMerchantList} style={[styles.button,{backgroundColor: '#F6F3BE'}]} accessibilityRole="button">
                    <Image style={{width:'40%', height: 100}} source={require("../happyImage/icon/商店.png")}/>
                    <Text style={{fontSize: 24}}>買東西</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToCart} style={styles.button} accessibilityRole="button">
                    <Image style={{width:'50%', height: 100}} source={require("../happyImage/icon/購物車.png")}/>
                    <Text style={{fontSize: 24}}>查看購物車</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', width: '100%', justifyContent:'center'} }>
                    <TouchableOpacity style={styles.button2} accessibilityRole="button" onPress={goToWallet}>
                        <Image style={{width:'95%', height: 100}} source={require("../happyImage/icon/錢包.png")}/>
                        <Text style={{fontSize: 24}}>查看錢包</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button2} accessibilityRole="button" onPress={goToRecord}>
                        <Image style={{width:'100%', height: 100}} source={require("../happyImage/icon/購買紀錄.png")}/>
                        <Text style={{fontSize: 24}}>查看紀錄</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const goToUploadingPage = () => {
        navigate('UploadingPage',{
            userData: userData
        })
    }
    const goToMyShopPage = () => {
        navigate('MyShopPage',{
            userData: userData
        })
    }

    /* ======== test ========*/
    const testIpfs = () => {
        ipfs.add("藍錢包上傳IPFS測試!", (err, ifpsResults) => {
            if (err) 
            {
                console.log(err);
                return ;
            }
            console.log(ifpsResults)
        })
        
    }
    
    /* ======== test over ======*/
    const renderMerchantPage = () => {
        return (
            <View style={styles.container}>
                <Text style={{fontSize: 24}}>{userData.攤商名稱}，你好!</Text>
                <BlueSpacing20/>
                <BlueSpacing40/>
                <TouchableOpacity style={styles.button} accessibilityRole="button" onPress={goToUploadingPage}>
                    <Image style={{width:'40%', height: 100}} source={require("../happyImage/icon/上傳.png")}/>
                    <Text style={{fontSize: 24}}>上傳商品</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,{backgroundColor: '#F6F3BE'}]} accessibilityRole="button" onPress={goToMyShopPage}>
                    <Image style={{width:'40%', height: 100}} source={require("../happyImage/icon/商店.png")}/>
                    <Text style={{fontSize: 24}}>查看我的商場</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', width: '100%', justifyContent:'center'} }>
                    <TouchableOpacity style={styles.button2} accessibilityRole="button" onPress={goToWallet}>
                        <Image style={{width:'96%', height: 100}} source={require("../happyImage/icon/錢包.png")}/>
                        <Text style={{fontSize: 24}}>查看錢包</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button2} accessibilityRole="button" onPress={goToRecord}>
                        <Image style={{width:'100%', height: 100}} source={require("../happyImage/icon/購買紀錄.png")}/>
                        <Text style={{fontSize: 24}}>查看紀錄</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        )
    }
    useEffect(() => {
        setIsLoading(false);
    }, []);
    return isLoading ? (
        <BlueLoading />
    ) : (
            <SafeBlueArea forceInset={{ horizontal: 'always' }} style={styles.root}>
                {loginType == 'user'? renderUserPage(): renderMerchantPage()}
                
            </SafeBlueArea>
        );
}

HomePage.navigationOptions = () => ({
    ...BlueNavigationStyle(),
    title: 'BlueWallet',
});

export default HomePage;