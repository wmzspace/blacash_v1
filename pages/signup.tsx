import * as React from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import {
  Text,
  TextInput,
  RadioButton,
  HelperText,
  useTheme,
  Portal,
  Modal,
} from 'react-native-paper';

import {StatusBarComp} from '../@components/StatusBarComp';
import styles from '../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RadioGroup from 'react-native-radio-buttons-group';
import Geolocation from 'react-native-geolocation-service';
import {serverIPP} from '../values/strings';
import {PreferencesContext} from '../context/preference';

const radioButtonsData = [
  {
    id: 1, //主键是必须有的
    label: '是',
    value: true,
  },
  {
    id: 2,
    label: '否',
    value: false,
  },
  // {
  //   id: 3,
  //   label: '?',
  //   value: null,
  //   selected: true,
  // },
];

const style = StyleSheet.create({
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 245,
    height: 50,
    backgroundColor: 'transparent',
    borderColor: 'rgba(171, 190, 215, 0.56)',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  textInput: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 1,
    width: 200,
    height: 50,
    fontSize: 14,
  },
});

export default function SignupScreen({navigation}) {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [address, setAddress] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [location, setLocation] = React.useState(null);
  const [userNameIsValid, setUserNameValidation] = React.useState(false);
  const [passwordIsValid, setPasswordValidation] = React.useState(false);
  const [readNotice, setReadNotice] = React.useState('');
  const userInfo = {userName: userName, password: password};
  const [radioButtons, setRadioButtons] = React.useState(radioButtonsData);

  function onPressRadioButton(radioButtonsArray) {
    setRadioButtons(radioButtonsArray);
    for (let option of radioButtonsArray) {
      if (option.selected) {
        setReadNotice(option.value);
      }
    }
  }

  const [currentLongitude, setCurrentLongitude] = React.useState('');
  const [currentLatitude, setCurrentLatitude] = React.useState('');
  const [locationStatus, setLocationStatus] =
    React.useState('点击左侧"位置"获取');
  //  () => {
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();

      // subscribeLocationLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            buttonNegative: undefined,
            buttonNeutral: undefined,
            buttonPositive: '',
            title: '定位请求',
            message: 'YeChat需要申请系统的定位权限',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          getOneTimeLocation();

          // subscribeLocationLocation();
        } else {
          setLocationStatus('权限被拒绝');
          Alert.alert('定位失败', '用户拒绝定位权限, 请尝试在设置中开启权限');
        }
      } catch (err) {
        console.warn('catch: ' + err);
      }
    }
  };

  const getOneTimeLocation = () => {
    setLocationStatus('定位获取中 ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        setLocationStatus('点击左侧"位置"获取');

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
        // console.log(`${currentLongitude},${currentLatitude}`)
        geocoder(currentLongitude, currentLatitude);
      },
      error => {
        if (error.message === 'No location provider available.') {
          setLocationStatus('点击左侧"位置"刷新)');
          Alert.alert('定位失败', '请检查GPS是否开启');
        } else if (error.message === 'Location permission was not granted.') {
          setLocationStatus('点击左侧"位置"刷新)');
          Alert.alert('定位失败', '用户拒绝定位权限, 请尝试在设置中开启权限');
        } else {
          setLocationStatus(error.message);
          Alert.alert('定位失败', error.message);
        }
        return 0;
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        //Will give you the location on location change

        setLocationStatus('You are Here');
        console.log(position);

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
      },
      error => {
        setLocationStatus(error.message);
        // Alert.alert("定位失败",error.message+"\n请检查是否打开GPS");
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      },
    );
  };

  const [formatted_address, setFormattedAddress] = React.useState('');
  const [province, setProvince] = React.useState('');
  const [city, setCity] = React.useState('');
  const [district, setDistrict] = React.useState('');
  const geocoder = (currentLongitude, currentLatitude) => {
    fetch(
      `https://restapi.amap.com/v3/geocode/regeo?output=json&location=${currentLongitude},${currentLatitude}&key=6db2f5900df5e3f3be3c2ef4cfb39f2a&radius=1000&extensions=all`,
      {
        method: 'GET',
      },
    )
      .then(res => {
        if (res.ok) {
          res.json().then(responseData => {
            console.log(responseData.regeocode.formatted_address);
            console.log(responseData.regeocode.addressComponent.province);
            console.log(responseData.regeocode.addressComponent.city);
            console.log(responseData.regeocode.addressComponent.district);
            setFormattedAddress(responseData.regeocode.formatted_address);
            setProvince(responseData.regeocode.addressComponent.province);
            setCity(responseData.regeocode.addressComponent.city);
            setDistrict(responseData.regeocode.addressComponent.district);
            setLocation(
              responseData.regeocode.addressComponent.province +
                ' ' +
                responseData.regeocode.addressComponent.city +
                ' ' +
                responseData.regeocode.addressComponent.district,
            );
          });
        } else {
          Alert.alert('请求失败', 'error', [
            {text: '确定', onPress: () => console.log('OK Pressed!')},
          ]);
        }
      })
      .catch(err => {
        console.log('err', err);
        Alert.alert('请求失败', err, [
          {text: '确定', onPress: () => console.log('OK Pressed!')},
        ]);
      });
  };

  const sendAjax = () => {
    fetch('http://' + serverIPP + '/signup', {
      //不能直接使用 wmzspace.space域名, 因为 域名开启了https防窜站
      method: 'POST',
      mode: 'cors', //之前是no-cors
      //same-origin - 同源请求，跨域会报error
      //no-cors - 默认，可以请求其它域的资源，不能访问response内的属性
      //cros - 允许跨域，可以获取第三方数据，必要条件是访问的服务允许跨域访问
      //navigate - 支持导航的模式。该navigate值仅用于HTML导航。导航请求仅在文档之间导航时创建。
      body: `name=${userInfo.userName}&password=${userInfo.password}&address=${address}&email=${email}&location=${location}&province=${province}&city=${city}&district=${district}&longitude=${currentLongitude}&latitude=${currentLatitude}`, // 上传到后端的数据
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
              Alert.alert('提示', responseData, [
                {
                  text: '确定',
                  onPress: () => {
                    console.log('OK Pressed!');
                    if (responseData.substring(0, 4) === '注册成功') {
                      navigation.navigate('Home');
                    }
                  },
                },
              ]);
            });
        } else {
          Alert.alert('请求失败', 'error', [
            {text: '确定', onPress: () => console.log('OK Pressed!')},
          ]);
        }
      })
      .catch(err => {
        console.log('err', err);
        Alert.alert('请求失败', err, [
          {text: '确定', onPress: () => console.log('OK Pressed!')},
        ]);
      });
  };

  const theme = useTheme();
  const {toggleTheme, isThemeDark} = React.useContext(PreferencesContext);

  const [NoticeVisible, setNoticeVisible] = React.useState(false);

  const showNotice = () => setNoticeVisible(true);
  const hideNotice = () => setNoticeVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};
  return (
    <View
      style={[
        styles.container,
        // useColorScheme() === 'dark'
        //   ? styles.darkBackgroundColor
        //   : styles.lightBackgroundColor,
      ]}>
      <StatusBarComp />
      <Portal>
        <Modal
          // theme={theme}
          visible={NoticeVisible}
          onDismiss={hideNotice}
          contentContainerStyle={containerStyle}>
          <Text style={{color: '#181818'}}>{`
声明：
请接受本声明！
`}</Text>
        </Modal>
      </Portal>
      <View style={{alignItems: 'center'}}>
        {/* <View style={{alignItems: 'center'}}> */}
        <Text style={{marginTop: 60, marginBottom: 20, fontSize: 20}}>
          BlaCash 账号注册
        </Text>
        <View>
          <TextInput
            style={style.textInput}
            placeholder="用户名*"
            placeholderTextColor={isThemeDark ? 'gray' : 'gray'}
            underlineColor={isThemeDark ? 'gray' : 'rgba(47,100,125,0.26)'}
            clearButtonMode="always"
            selectionColor="skyblue"
            maxLength={19}
            onChangeText={_userName => {
              setUserName(_userName);
              setUserNameValidation(_userName.length >= 6);
              // dispatch({type: 'userName', userName: userName});
            }}
            left={<TextInput.Icon icon="account" />}
          />
          <HelperText
            type="error"
            style={{display: userNameIsValid || !userName ? 'none' : 'flex'}}>
            用户名需至少6个字符
          </HelperText>

          <TextInput
            style={style.textInput}
            placeholder="密码*"
            placeholderTextColor={isThemeDark ? 'gray' : 'gray'}
            underlineColor={isThemeDark ? 'gray' : 'rgba(47,100,125,0.26)'}
            secureTextEntry={true}
            clearButtonMode="always"
            selectionColor="red"
            maxLength={19}
            onChangeText={_password => {
              setPassword(_password);
              setPasswordValidation(_password.length >= 6);
              // dispatch({type: 'password', password: password});
            }}
            left={<TextInput.Icon icon="lock" />}
          />
          <HelperText
            type="error"
            style={{display: passwordIsValid || !password ? 'none' : 'flex'}}>
            密码需至少6个字符
          </HelperText>

          <TextInput
            style={style.textInput}
            placeholder="邮箱*"
            placeholderTextColor={isThemeDark ? 'gray' : 'gray'}
            underlineColor={isThemeDark ? 'gray' : 'rgba(47,100,125,0.26)'}
            clearButtonMode="always"
            maxLength={30}
            onChangeText={email_ => {
              setEmail(email_);
            }}
            left={<TextInput.Icon icon="email" />}
          />
          <HelperText
            type="error"
            style={{
              display:
                email && !(email.includes('@') && email.includes('.'))
                  ? 'flex'
                  : 'none',
            }}>
            邮箱格式不正确
          </HelperText>

          {/*</View>*/}
          <View style={style.inputWrap}>
            <Text onPress={requestLocationPermission}>位置: </Text>
            <TextInput
              style={style.textInput}
              placeholder={locationStatus}
              placeholderTextColor={isThemeDark ? 'gray' : 'gray'}
              // underlineColor={isThemeDark ? 'gray' : 'rgba(47,100,125,0.26)'}
              value={province ? province + ' ' + city + ' ' + district : ''}
              clearButtonMode="always"
              maxLength={100}
              onChangeText={_location => {
                setLocation(_location);
              }}
            />
          </View>

          <View style={style.inputWrap}>
            <Text>钱包地址: </Text>
            <TextInput
              style={style.textInput}
              placeholder="必填*"
              placeholderTextColor={isThemeDark ? 'gray' : 'gray'}
              // value={province ? province + ' ' + city + ' ' + district : ''}
              clearButtonMode="always"
              maxLength={100}
              onChangeText={_address => {
                setAddress(_address);
              }}
            />
          </View>
          {/* TODO: 阅读声明的超链接*/}
          <View style={style.inputWrap}>
            <Text>
              <Text style={{color: 'blue'}} onPress={showNotice}>
                阅读声明
              </Text>
              并接受:{' '}
            </Text>
            {/*<RadioGroup*/}
            {/*  radioButtons={radioButtons}*/}
            {/*  onPress={onPressRadioButton}*/}
            {/*  containerStyle={{width: 40}}*/}
            {/*  layout="row"*/}
            {/*/>*/}
            <RadioButton.Group
              onValueChange={newValue => {
                setReadNotice(newValue);
              }}
              value={readNotice}>
              <View style={[styles.inlineFlex]}>
                <View style={[styles.inlineFlex]}>
                  <Text style={{paddingTop: 7, color: 'gray'}}>是</Text>
                  <RadioButton value="yes" />
                </View>
                <View style={styles.inlineFlex}>
                  <Text style={{paddingTop: 7, color: 'gray'}}>否</Text>
                  <RadioButton value="no" />
                </View>
              </View>
            </RadioButton.Group>
          </View>
          {/*<Text*/}
          {/*  style={{*/}
          {/*    alignContent: 'flex-start',*/}
          {/*    color: 'red',*/}
          {/*    marginBottom: 10,*/}
          {/*    display:*/}
          {/*      (userNameIsValid && passwordIsValid) ||*/}
          {/*      !(userName.length * password.length)*/}
          {/*        ? 'none'*/}
          {/*        : 'flex',*/}
          {/*  }}>*/}
          {/*  用户名和密码需至少6个字符*/}
          {/*</Text>*/}
          <Text style={{alignContent: 'flex-start'}}>
            已有账号？
            <Text
              style={{color: 'blue', textDecorationLine: 'underline'}}
              onPress={() => {
                navigation.navigate('Login');
              }}>
              立即登录
            </Text>
          </Text>
        </View>

        <TouchableHighlight
          // onPress={() => navigation.navigate('Home')}
          onPress={sendAjax}
          disabled={
            !(
              userNameIsValid &&
              passwordIsValid &&
              address &&
              email &&
              readNotice
            )
          }
          style={
            userNameIsValid &&
            passwordIsValid &&
            address &&
            email.includes('@') &&
            email.includes('.') &&
            readNotice === 'yes'
              ? [styles.button, {backgroundColor: 'blue'}]
              : styles.disabledButton
          }>
          <Text style={{color: '#f5fcfa', fontSize: 16}}>注册</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}
