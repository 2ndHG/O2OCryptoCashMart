import React, { useState, useEffect,Component} from 'react';
import { ScrollView, StyleSheet, TextInput, Alert, TouchableOpacity, ImageBackground, View, Image, Text } from 'react-native';
import { useNavigation, useTheme, useRoute } from '@react-navigation/native';
import { BlueLoading, SafeBlueArea, BlueCard, BlueText, BlueNavigationStyle, BlueSpacing20, BlueListItem, BlueSpacing10, BlueSpacing40 } from '../BlueComponents';
import ImagePicker from 'react-native-image-picker'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Dimensions } from 'react-native';

/** @type {AppStorage} */

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderColor: "gray",
        fontSize: 20,
    },
    text: {
        fontSize: 24
    },
    imagePickerTouch: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        borderRadius: 20,
        position: 'absolute',
        left: 24,
        bottom: 48,
      },
    button: {
        backgroundColor: '#FEFD9B',
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
        backgroundColor: '#7FFFE0',
        borderRadius: 20,
        padding: 10,
        marginBottom: 5,
        shadowColor: '#303838',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        shadowOpacity: 0.35,
        alignItems: 'center',
        width:'70%',
      },
});
  
const UploadingPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [itemName, setItemName] = useState('');
    const [itemIntro, setItemIntro] = useState('');
    const [itemAmount, setItemAmount] = useState(0);
    const [itemPrice, setItemPrice] = useState(0);
    const [itemPhoto, setItemPhoto] = useState(null);
    const [itemPhotoHeight, setItemPhotoHeight] = useState(0);

    const options = {
        title: 'Select Avatar',
        customButtons: [{ name: '商品', title: '選擇商品圖片' }],
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
      };
      
    //==========================照片選擇器======================
    
    const chooseImageFromLibrary = () => {
        launchImageLibrary(
            options,
            response => {
              if (response.didCancel) {
                setIsLoading(false);
              } else {
                const asset = response.assets[0];
                console.log("response", response)
                console.log("uri", asset.uri);
                if (asset.uri) {
                    const uri = asset.uri.toString().replace('file://', '');
                    setItemPhoto(asset.uri);
                    //取得裝置寬度
                    const screenWidth = Dimensions.get('window').width;
                    //原圖長/寬 = 改變後的長/改變後的寬
                    let h = (screenWidth * 0.8) * asset.height / asset.width;
                    setItemPhotoHeight(h)
                    
                    console.log(uri);
                } else {
                  setIsLoading(false);
                }
                
              }
            },
          );
    }
    const chooseImageByCamera = () => {
        launchCamera(
            options,
            response => {
              if (response.didCancel) {
                setIsLoading(false);
              } else {
                console.log('從手機拍照了');
                /*
                const asset = response.assets[0];
                console.log("response", response)
                console.log("uri", asset.uri);
                if (asset.uri) {
                    const uri = asset.uri.toString().replace('file://', '');
                    setItemPhoto(asset.uri);
                    //取得裝置寬度
                    const screenWidth = Dimensions.get('window').width;
                    //原圖長/寬 = 改變後的長/改變後的寬
                    let h = (screenWidth * 0.8) * asset.height / asset.width;
                    setItemPhotoHeight(h)
                    
                    console.log(uri);
                } else {
                  setIsLoading(false);
                }
                */
              }
            },
          );
    }

    const uploadToServer = () => {
        console.log("按下確認上傳");
        const body = new FormData();
        body.append('file', {
            uri: '你好',
            name: 'photo.png',
            filename :'OKOK.png',
            type: 'image/png'
        });
        body.append('Content-Type', 'image/png');
        body.append('abc', 123);
        body.商品名稱 = itemName;
        console.log(body);
        fetch('http://10.0.2.2:3101/uploadData/upload', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                //multi-form
            },
            method: 'POST',
            body: JSON.stringify(body)
        }).then(response => {
            return response.json();
        }).then(message => {
            console.log(message);
        }).catch(err => {
            console.log("傳送錯誤! ", err)
        })
        
        // fetch('http://10.0.2.2:3101/login', {
        //     headers: { "Content-Type": "application/json" },
        //     method: 'POST',
        //     body: JSON.stringify({
        //         type: 'userdfgdfg',
        //         address: 'address',
        //         password: 'password'
        //     })
        // })
    }
    const renderPhoto = () => {
        return (
            <Image source={{uri: itemPhoto.uri}} style={{width: '80%'}}></Image>
        )
    }
    useEffect(() => {
        setIsLoading(false);
    }, []);
    return isLoading ? (
        <BlueLoading />
    ) : (
            <SafeBlueArea forceInset={{ horizontal: 'always' }}>
                <BlueCard >
                    <ScrollView>
                        <Text style={styles.text}>商品名稱</Text>
                        <TextInput
                            value={itemName}
                            onChangeText={event => setItemName(event)}
                            name="itemName"
                            placeholder='請輸入商品名稱'
                            type="text"
                            style={styles.textInput}
                        />
                        <BlueSpacing20/>
                        <Text style={styles.text}>商品介紹</Text>
                        <TextInput
                            value={itemIntro}
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={event => setItemIntro(event)}
                            name="itemIntro"
                            placeholder='請輸入商品的介紹(最多200字)'
                            maxLength={200}
                            type="text"
                            style={styles.textInput}
                        />
                        <BlueSpacing20/>
                        <Text style={styles.text}>商品價格</Text>
                        <TextInput
                            value={itemPrice}
                            onChangeText={event => setItemPrice(event)}
                            name="itemPrice"
                            placeholder='請輸入商品價格(新台幣)'
                            keyboardType='numeric'
                            style={styles.textInput}
                        />
                        <BlueSpacing20/>
                        <Text style={styles.text}>商品數量</Text>
                        <TextInput
                            value={itemAmount}
                            onChangeText={event => setItemAmount(event)}
                            name="itemAmount"
                            placeholder='請輸入商品數量'
                            keyboardType='numeric'
                            style={styles.textInput}
                        />
                        <BlueSpacing10/>
                       {
                       <View style={{alignItems: 'center'}}>
                            <TouchableOpacity style={styles.button2} onPress={chooseImageFromLibrary} >
                                <Text style={styles.btnText}>選取照片</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button2} onPress={chooseImageByCamera}>
                                <Text style={styles.btnText}>從手機拍攝</Text>
                            </TouchableOpacity>
                            {itemPhoto && <Image source={{ uri: itemPhoto,}} style={{ width: '80%', height: itemPhotoHeight, }} /> } 
                            {/*
                            <TouchableOpacity onPress={() => {console.log(itemPhoto);}} >
                                <Text style={styles.btnText}>確認選擇圖片uri</Text>
                            </TouchableOpacity> 
                            */
                            }  
                        </View>
                        }
                        
                        <View style={{alignItems: 'center'}}>
                            <TouchableOpacity onPress={uploadToServer} style={styles.button} accessibilityRole="button">
                                <Image style={{width:'20%', height: 40}} source={require("../happyImage/icon/上傳.png")}/>
                                <Text style={{fontSize: 24}}>確認上傳</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </BlueCard>
            </SafeBlueArea>
        );
}

UploadingPage.navigationOptions = () => ({
    ...BlueNavigationStyle(),
    title: 'BlueWallet',
});

export default UploadingPage;