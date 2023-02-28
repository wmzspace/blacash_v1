import * as React from 'react';
import {
  Alert,
  ImageBackground,
  useColorScheme,
  Linking,
  BackHandler,
  ScrollView,
  View,
  Image,
  NativeModules,
} from 'react-native';
import {Text} from 'react-native-paper';

import {TouchableOpacity} from 'react-native-gesture-handler';
import {StatusBarComp} from '../@components/StatusBarComp';
import * as Animatable from 'react-native-animatable';
import styles from '../styles';

import {Provider as PaperProvider} from 'react-native-paper';
import {serverIPP} from '../values/strings';

import Toast from 'react-native-toast-message';

export default function HomeScreen({navigation}) {
  // const showToast = () => {
  //   Toast.show({
  //     type: 'error',
  //     text1: 'Hello',
  //     text2: 'This is some something 👋',
  //   });
  // };

  const currentVersion = 'demo_1.2';
  let checkUpdate = () => {
    // 43.143.213.226:8088
    fetch('http://' + serverIPP + '/checkUpdate', {
      //不能直接使用 wmzspace.space域名, 因为 域名开启了https防窜站
      method: 'POST',
      mode: 'cors',
      body: `version=${currentVersion}`, // 上传到后端的数据
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Content-Type': 'multipart/form-data;charset=utf-8', //非文本内容
        // 'Content-Type': 'multipart/form-data;boundary=------FormBoundary15e896376d1'
      },
    })
      .then(res => {
        if (res.ok) {
          //数据解析方式
          res
            //.arrayBuffer() // ArrayBuffer/ArrayBufferView
            // .json() // Json file, need JSON.stringify(...)
            .text() // String
            //.blob()        // Blob/File
            //.formData()    // FormData
            .then(responseData => {
              //从后端返回的数据(res.end())
              if (responseData !== '1') {
                Alert.alert('检查到新版本', responseData, [
                  {
                    text: '退出',
                    onPress: () => {
                      navigation.navigate('Home');
                      BackHandler.exitApp();
                    },
                  },
                ]);
                Linking.openURL(
                  `https://wmzspace.space/yechat/yechat_${currentVersion}.apk`,
                );
              }
            });
        } else {
          Alert.alert('无法进入Blacash', '检查更新失败', [
            {
              text: '退出',
              onPress: () => {
                navigation.navigate('Home');
                BackHandler.exitApp();
              },
            },
          ]);
        }
      })
      .catch(err => {
        // console.log('err', err);
        Alert.alert('网络请求失败', err.message, [
          {
            text: '退出',
            onPress: () => {
              navigation.navigate('Home');
              BackHandler.exitApp();
              // NativeModules.ExitManager.exitApp();
            },
          },
        ]);
        // showToast();
      });
  };
  checkUpdate();

  return (
    <PaperProvider>
      <View style={[styles.container]}>
        <StatusBarComp isDarkStyle="true" />
        <Animatable.View animation="fadeIn" style={{flex: 1}} delay={500}>
          <Image
            style={{
              flex: 1,
              alignSelf: 'center',
              resizeMode: 'contain',
              width: 600,
            }}
            source={require('../images/logo_transparent.png')}
          />
          <Animatable.View
            style={[styles.inlineFlex, {justifyContent: 'space-between'}]}
            animation="fadeInUp"
            delay={2000}
            duration={1000}>
            <TouchableOpacity
              onPress={() => {
                checkUpdate();
                navigation.navigate('Login');
              }}
              style={[
                styles.button2,
                {
                  backgroundColor: '#06be5e',
                },
              ]}>
              <Text style={{color: '#fcfcfc', fontSize: 16}}>登录</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                checkUpdate();
                navigation.navigate('Signup');
              }}
              style={[
                styles.button2,
                useColorScheme() === 'dark'
                  ? styles.darkBackgroundColor
                  : styles.lightBackgroundColor,
              ]}>
              <Text style={{fontSize: 16}}>注册</Text>
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>
      </View>
    </PaperProvider>
  );
}
