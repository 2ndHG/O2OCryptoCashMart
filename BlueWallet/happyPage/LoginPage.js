import React, { useState, useEffect,Component} from 'react';
import { ScrollView, StyleSheet, TextInput, Button, Alert, ImageBackground, View, Image } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { BlueLoading, SafeBlueArea, BlueCard, BlueText, BlueNavigationStyle, BlueSpacing20, BlueListItem, BlueSpacing10, BlueSpacing40 } from '../BlueComponents';
import { UserState } from 'realm';
import { LoginButton } from '../happyComponents/LoginButton';
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

const LoginPage = () => {
    
    const [isLoading, setIsLoading] = useState(true);
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [waitingResponse, setwaitingResponse] = useState(false);
    const [loginState, setLoginState] = useState({})
    const { navigate } = useNavigation();
    const printValues = e => {
        e.preventDefault();
        console.log(address, password);
    };
    const userLogIn = async function() {  
       
        if (address != '' && password != ''){
            console.log('按下使用者登入按鈕');
            try {
                setwaitingResponse(true); //等待伺服器回應
                fetch('http://10.0.2.2:3101/login', {
                    headers: { "Content-Type": "application/json" },
                    method: 'POST',
                    body: JSON.stringify({
                        type: 'user',
                        address: address,
                        password: password
                    })
                }).then((response) => {
                    return response.json(); 
                }).then((jsonData) => {
                    setLoginState(jsonData);
                    if(jsonData.loginOK != true) {
                        Alert.alert(
                            "登入失敗",
                            "原因: " + jsonData.message
                        )
                    }
                    else {
                        navigate('HomePage',{
                            userData: jsonData.userData,
                            loginType: 'user'
                        })
                    }
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
        else{
            console.log('Please enter username and password')//沒輸入
            Alert.alert(
                "未輸入完整!",
                "請完整地輸入帳號和密碼"
            )
        }
    }
    const merchantLogIn = async function() {  
       
        if (address != '' && password != ''){
            console.log('按下攤商登入按鈕');
            try {
                setwaitingResponse(true); //等待伺服器回應
                fetch('http://10.0.2.2:3101/login', {
                    headers: { "Content-Type": "application/json" },
                    method: 'POST',
                    body: JSON.stringify({
                        type: 'merchant',
                        address: address,
                        password: password
                    })
                }).then((response) => {
                    return response.json(); 
                }).then((jsonData) => {
                    //console.log(jsonData)
                    setLoginState(jsonData);
                    if(jsonData.loginOK != true) {
                        Alert.alert(
                            "登入失敗",
                            "原因: " + jsonData.message
                        )
                    }
                    else {
                        navigate('HomePage',{
                            userData: jsonData.userData,
                            loginType: 'merchant'
                        })
                    }
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
        else{
            console.log('Please enter username and password')//沒輸入
            Alert.alert(
                "未輸入完整!",
                "請完整地輸入帳號和密碼"
            )
        }
    }
    const delivererLogIn = async function() {  
       
        if (address != '' && password != ''){
            console.log('按下外送員登入按鈕');
            try {
                setwaitingResponse(true); //等待伺服器回應
                fetch('http://10.0.2.2:3101/login', {
                    headers: { "Content-Type": "application/json" },
                    method: 'POST',
                    body: JSON.stringify({
                        type: 'deliverer',
                        address: address,
                        password: password
                    })
                }).then((response) => {
                    return response.json(); 
                }).then((jsonData) => {
                    //console.log(jsonData)
                    setLoginState(jsonData);
                    if(jsonData.loginOK != true) {
                        Alert.alert(
                            "登入失敗",
                            "原因: " + jsonData.message
                        )
                    }
                    else {
                        navigate('DelivererPage',{
                            userData: jsonData.userData,
                            loginType: 'deliverer'
                        })
                    }
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
        else{
            console.log('Please enter username and password')//沒輸入
            Alert.alert(
                "未輸入完整!",
                "請完整地輸入帳號和密碼"
            )
        }
    }
    const testMerchantLogin = () => {
        try {
            setwaitingResponse(true); //等待伺服器回應
            fetch('http://10.0.2.2:3101/login', {
                headers: { "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify({
                    type: 'merchant',
                    address: 'm1@gmail.com',
                    password: '1111'
                })
            }).then((response) => {
                return response.json(); 
            }).then((jsonData) => {
                //console.log(jsonData)
                setLoginState(jsonData);
                if(jsonData.loginOK != true) {
                    Alert.alert(
                        "登入失敗",
                        "原因: " + jsonData.message
                    )
                }
                else {
                    navigate('HomePage',{
                        userData: jsonData.userData,
                        loginType: 'merchant'
                    })
                }
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
    const testUserLogin = () => {
        try {
            setwaitingResponse(true); //等待伺服器回應
            fetch('http://10.0.2.2:3101/login', {
                headers: { "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify({
                    type: 'user',
                    address: 'u1@gmail.com',
                    password: '1111'
                })
            }).then((response) => {
                return response.json(); 
            }).then((jsonData) => {
                //console.log(jsonData)
                setLoginState(jsonData);
                if(jsonData.loginOK != true) {
                    Alert.alert(
                        "登入失敗",
                        "原因: " + jsonData.message
                    )
                }
                else {
                    navigate('HomePage',{
                        userData: jsonData.userData,
                        loginType: 'user'
                    })
                }
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
    useEffect(() => {
        setIsLoading(false);
    }, []);
    return isLoading ? (
        <BlueLoading />
    ) : (
            <SafeBlueArea forceInset={{ horizontal: 'always' }} style={styles.root}>
                <BlueSpacing40/>
                <BlueSpacing10/>
                <Image 
                        style={{width:'100%'}}
                        source={ require('../happyImage/app登入頁面.png')}
                        resizeMode='contain'
                />
                <ScrollView>
                    
                    
                    <BlueSpacing40/>
                    <BlueSpacing40/>
                    <BlueCard >
                        <TextInput
                            value={address}
                            onChangeText={event => setAddress(event)}
                            name="address"
                            placeholder='請輸入信箱地址'
                            type="text"
                            style={{
                                borderWidth:0.5,
                                borderColor: "grey",
                                fontSize: 20,
                            }}
                        />
                        <BlueSpacing10/>
                        <TextInput
                            value={password}
                            onChangeText={event => setPassword(event)}
                            name="password"
                            placeholder='請輸入密碼'
                            secureTextEntry
                            type="password"
                            style={{
                                borderWidth: 0.5,
                                borderColor: "grey",
                                fontSize:20,
                            }}
                        />
                    </BlueCard>
                    <LoginButton text='使用者登入' onPress={userLogIn}></LoginButton>
                    <LoginButton text='攤商登入' onPress={merchantLogIn}></LoginButton>
                    <LoginButton text='外送員登入' onPress={delivererLogIn}></LoginButton>
                    {<LoginButton text='快速使用者登入(測試模式)' onPress={testUserLogin}></LoginButton>
                    }
                    {<LoginButton text='快速攤商登入(測試模式)' onPress={testMerchantLogin}></LoginButton>
                    }
                    
                    </ScrollView>
            </SafeBlueArea>
        );
};

LoginPage.navigationOptions = () => ({
    ...BlueNavigationStyle(),
    title: 'BlueWallet',
});

export default LoginPage;
