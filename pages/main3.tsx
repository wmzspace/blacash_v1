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

export default function MainScreen({route, navigation}) {
  return (
    <View
      style={[
        styles.container,
        useColorScheme() === 'dark'
          ? styles.darkBackgroundColor
          : styles.lightBackgroundColor,
      ]}>
      <SafeAreaView style={styles.container}>
        <Text>开发中</Text>
      </SafeAreaView>
      <StatusBarComp />
    </View>
  );
}
