import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {StatusBarComp} from '../@components/StatusBarComp';
import {TextInput} from 'react-native-gesture-handler';

// var date = new Date();

// var year = date.getFullYear().toString();
// var month = (date.getMonth()+1).toString();
// var day = date.getDate().toString();
// var hour =  date.getHours().toString();

// import styles from '../styles';
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputWrap: {
    // overflow:'visible',
    flexDirection: 'row',
    alignItems: 'center',
    // width: 245,
    // height: 50,
    backgroundColor: 'transparent',
    // borderColor: 'rgba(171, 190, 215, 0.56)',
    // borderBottomWidth: 1,
    marginBottom: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  textInput: {
    marginHorizontal: 20,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 1,

    // width: 200,

    // height: 500,
    fontSize: 14,
  },
});
const DATA = [
  // {
  //   id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
  //   title: 'First Item',
  // },
  // {
  //   id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
  //   title: 'Second Item',
  // },
  // {
  //   id: '58694a0f-3da1-471f-bd96-145571e29d72',
  //   title: 'Third Item',
  // },
];

const Item = ({item, onPress, style}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Text style={styles.title}>{item.author}</Text>
    <Text>{item.time}</Text>
    <Text>{item.message}</Text>
  </TouchableOpacity>
);

export default function MainScreen({route, navigation}) {
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState(null);
  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? 'skyblue' : 'lightblue';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        style={{backgroundColor}}
      />
    );
  };

  const refreshData =() => {
    fetch('http://43.143.213.226:8085/refresh', {
      method: 'GET',
    })
      .then(res => {
        if (res.ok) {
          res.json().then(responseData => {
            DATA.length = 0;
            for (
              let i = responseData.length - 1;
              i >= responseData.length - responseData.length;
              i--
            ) {
              DATA.push({
                id: responseData[i].id,
                author: responseData[i].sender,
                // time: (new Date()).toLocaleDateString() + ' ' + (new Date()).toLocaleTimeString(),
                time: new Date(
                  Date.parse(responseData[i].sendtime.toString()),
                ).toLocaleString(),
                message: responseData[i].msg,
              });
            }
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

  refreshData();
  // if (route.params.needRefresh) {
    
  //   refreshData();
  //   navigation.navigate('Main', {
  //     userName: route.params.userName,
  //     needRefresh:false
  //   });
  // }
return (
    <View
      style={[
        styles.container,
        useColorScheme() === 'dark'
          ? styles.darkBackgroundColor
          : styles.lightBackgroundColor,
      ]}>
      <SafeAreaView style={styles.container}>
        <View
          style={{
            borderColor: 'rgba(171, 190, 215, 0.56)',
            borderBottomWidth: 1,
          }}>
          <View style={styles.inputWrap}>
            <Text></Text>
            <TextInput
              style={styles.textInput}
              placeholder="我也说一句:"
              clearButtonMode="always"
              selectionColor="skyblue"
              maxLength={100}
              // textAlignVertical='top'
              multiline={true}
              onChangeText={_message => {
                setMessage(_message);
              }}
              value={message}
            />
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <TouchableOpacity
              onPress={() => {
                if (message === null) {
                  Alert.alert('发送失败', '消息不能为空', [{text: '确定'}]);
                  return;
                }

                // DATA.push({
                //   id: DATA.length,
                //   author:"wmz",
                //   time: (new Date()).toLocaleDateString() + ' ' + (new Date()).toLocaleTimeString(),
                //   message:"!!!\n!\n!!!"
                // });
                fetch('http://43.143.213.226:8085/send', {
                  method: 'POST',
                  mode: 'cors', //之前是no-cors
                  body: `author=${route.params.userName}&message=${message}&sender=${route.params.userName}`, // 上传到后端的数据
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                })
                  .then(res => {
                    if (res.ok) {
                      //数据解析方式
                      res.json().then(responseData => {
                        DATA.length = 0;
                        for (
                          let i = responseData.length - 1;
                          i >= responseData.length - responseData.length;
                          i--
                        ) {
                          DATA.push({
                            id: responseData[i].id,
                            author: responseData[i].sender,
                            // time: (new Date()).toLocaleDateString() + ' ' + (new Date()).toLocaleTimeString(),
                            time: new Date(
                              Date.parse(responseData[i].sendtime.toString()),
                            ).toLocaleString(),
                            message: responseData[i].msg,
                          });
                        }
                        //从后端返回的数据(res.end())
                        // Alert.alert('提示', responseData, [
                        //   {
                        //     text: '确定',
                        //     onPress: () => {
                        //       console.log('OK Pressed!');
                        //       if (responseData.substring(0, 4) == '注册成功') {
                        //         navigation.navigate('Home');
                        //       }
                        //     },
                        //   },
                        // ]);
                        setMessage(null);
                      });
                    } else {
                      Alert.alert('请求失败', 'error', [
                        {
                          text: '确定',
                          onPress: () => console.log('OK Pressed!'),
                        },
                      ]);
                    }
                  })
                  .catch(err => {
                    console.log('err', err);
                    Alert.alert('请求失败', err, [
                      {text: '确定', onPress: () => console.log('OK Pressed!')},
                    ]);
                  });
              }}
              style={{
                marginEnd: 30,
                padding: 8,
                paddingHorizontal: 15,
                marginBottom: 8,
                backgroundColor: 'lightblue',
                borderRadius: 5,
                opacity: 0.6,
              }}>
              <Text style={{}}>发送</Text>
          </TouchableOpacity>
          </View>
          <Text style={{alignSelf:'center'}}>下拉刷新</Text>
        </View>

        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedId}
          onRefresh={() => {
  
            navigation.navigate('Main', {
              userName: route.params.userName,
              needRefresh:false
            });
          }}
          refreshing={false}
        />
      </SafeAreaView>
      <StatusBarComp />
    </View>
  );
}
