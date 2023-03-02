import * as React from 'react';
import {serverIPP} from '../values/strings';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Searchbar, Text} from 'react-native-paper';
import ScreenWrapper from '../@components/ScreenWrapper';
import {globalVal, userInfo} from '../values/global';
import {getNftImgs} from '../apis/api';

export const UploadScreen = () => {
  // const [url, setUrl] = React.useState('');

  return (
    <View>
      <Text>!</Text>
      <Button
        onPress={() => {
          fetch('http://' + serverIPP + '/upload', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
              url: 'http://waa.cool:4000/public/nft_img/1676822586623-2134.jpg',
              nftName: '测试大象',
              nftDescription: '我是测试大象，真好玩',
              owner: userInfo.email,
              fee: 2.0,
            }),
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }).then(res => {
            if (res.ok) {
              res.text().then(resData => {
                // console.log(resData);
                Alert.alert('上传成功！', resData);
              });
            } else {
              Alert.alert('请求失败', 'error', [
                {text: '确定', onPress: () => console.log('OK Pressed!')},
              ]);
            }
          });
        }}>
        Test
      </Button>
    </View>
  );
};
