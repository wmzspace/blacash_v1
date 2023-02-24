import * as React from 'react';
import {useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import styles from './styles';

import HomeScreen from './pages/home';
import SignupScreen from './pages/signup';
import LoginScreen from './pages/login';
import MainScreen from './pages/main';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            title: '注册账号',
            headerTitleAlign: 'center',
            headerStyle: [
              useColorScheme() === 'dark'
                ? styles.darkBackgroundColor
                : styles.lightBackgroundColor,
            ],
            headerTintColor: useColorScheme() === 'dark' ? '#ffffff' : 'black',
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: '登录账号',
            headerTitleAlign: 'center',
            headerStyle: [
              useColorScheme() === 'dark'
                ? styles.darkBackgroundColor
                : styles.lightBackgroundColor,
              {borderWidth: 0},
            ],
            headerTitleStyle: {borderColor: 'white', borderWidth: 0},
            headerTintColor: useColorScheme() === 'dark' ? '#ffffff' : 'black',
          }}
        />
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{
            // headerShown: false,

            title: 'Yechat',
            headerTitleAlign: 'center',
            headerStyle: [
              useColorScheme() === 'dark'
                ? styles.darkBackgroundColor
                : styles.lightBackgroundColor,
              {borderWidth: 0},
            ],
            headerTitleStyle: {borderColor: 'white', borderWidth: 0},
            headerTintColor: useColorScheme() === 'dark' ? '#ffffff' : 'black',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
