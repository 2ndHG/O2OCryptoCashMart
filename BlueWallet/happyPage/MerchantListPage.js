import React, { useState, useEffect,Component} from 'react';
import { ScrollView, StyleSheet, TextInput, Button, Alert, ImageBackground, View, Image, FlatList } from 'react-native';
import { useNavigation, useTheme, useRoute } from '@react-navigation/native';
import { BlueLoading, SafeBlueArea, BlueCard, BlueText, BlueNavigationStyle, BlueSpacing20, BlueListItem, BlueSpacing10, BlueSpacing40 } from '../BlueComponents';
import { UserState } from 'realm';
import { LoginButton } from '../happyComponents/LoginButton';
import { Text } from 'react-native-elements';
import { MerchantCard } from '../happyComponents/MerchantCard';
import { TouchableOpacity } from 'react-native-gesture-handler';



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

const MerchantListPage = () => {
    
    const [isLoading, setIsLoading] = useState(true);
    const [merchantList, setMerchantList] = useState({});
    const [waitingResponse, setwaitingResponse] = useState(false);
    const {userData, loginType} = useRoute().params;

    const { navigate } = useNavigation();
    const fetchMerchantList = async function() {  
        try {
            console.log('尋找攤商資料...');
            setwaitingResponse(true); //等待伺服器回應
            fetch('http://10.0.2.2:3101/getData/getMerchantList', {
                headers: { "Content-Type": "application/json" },
                method: 'GET'
            }).then((response) => {
                return response.json(); 
            }).then((jsonData) => {
                setMerchantList(jsonData)
                console.log('找到攤商資料', jsonData);
            }).catch((err) => {
                console.log('錯誤:', err);
            })
        } catch (error) {
            console.error(error);
        } finally {
            //結束等待
            setwaitingResponse(false);
        }
    }
    const goToShopPage = (攤商GUID) => {
        navigate('ShopPage',{
            userData: userData,
            loginType: loginType,
            merchantGUID: 攤商GUID
        })
    }
    //引數一定要叫做item因為傳過來的是一個data:  
        // {"index": 0, 
        // "item": {"攤商GUID": "9e5fe895-928a-4358-84d9-5b9fbff2", "攤商介紹": "吃了我們的菜會很開心", "攤商名稱": "開心菜園", "攤商圖片": "m2.png"},
        // "separators": {"highlight": [Function highlight], "unhighlight": [Function unhighlight], 
        // "updateProps": [Function updateProps]}}
    //必須使用物件解構解出我們要的物件

    /* !!!!!!這很重要!!!!!!!onPress要用箭頭函式再帶入一次，否則在render階段會直接執行!!!!!! */
    const renderMerchantCard = ( {item, index}) => {
        console.log("商品卡 ", index);
        return (
        <MerchantCard 
            onPress={() => goToShopPage(item.攤商GUID)}
            攤商介紹={item.攤商介紹} 
            攤商名稱={item.攤商名稱}
            攤商GUID={item.攤商GUID}
            攤商圖片={item.攤商圖片}
            index={index}
        >
        </MerchantCard>
    )};


    
    useEffect(() => {
        fetchMerchantList();
        setIsLoading(false);
    }, []);
    


    return isLoading ? (
        <BlueLoading />
    ) : (
            <SafeBlueArea forceInset={{ horizontal: 'always' }} style={styles.root}>

                {merchantList[0] && 
                    <FlatList
                        data={merchantList}
                        renderItem={renderMerchantCard}
                        keyExtractor={攤商 => 攤商.攤商GUID}
                    />
                }
            </SafeBlueArea>
        );
};



MerchantListPage.navigationOptions = () => ({
    ...BlueNavigationStyle(),
    title: 'BlueWallet',
});

export default MerchantListPage;
