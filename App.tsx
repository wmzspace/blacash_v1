import * as React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './pages/home';
import SignupScreen from './pages/signup';
import LoginScreen from './pages/login';
import MainScreen from './pages/main';
const Stack = createStackNavigator();

import {Provider as PaperProvider, Text} from 'react-native-paper';

import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {MD2DarkTheme, MD2LightTheme} from 'react-native-paper';
import merge from 'deepmerge';
import {View} from 'react-native';
const CombinedDefaultTheme = merge(MD2DarkTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(MD2LightTheme, NavigationDarkTheme);
import {PreferencesContext} from './context/preference';

import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

const toastConfig = {
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({text1, props}) => (
    <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};
export default function App() {
  const [isThemeDark, setIsThemeDark] = React.useState(false);
  let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;
  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark],
  );
  return (
    <>
      <PreferencesContext.Provider value={preferences}>
        <PaperProvider theme={theme}>
          <NavigationContainer theme={theme}>
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
                    // useColorScheme() === 'dark'
                    //   ? styles.darkBackgroundColor
                    //   : styles.lightBackgroundColor,
                  ],
                  // headerTintColor:
                  // useColorScheme() === 'dark' ? '#ffffff' : 'black',
                }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  title: '登录账号',
                  headerTitleAlign: 'center',
                  headerStyle: [
                    // useColorScheme() === 'dark'
                    //   ? styles.darkBackgroundColor
                    //   : styles.lightBackgroundColor,
                    // {borderWidth: 0},
                  ],
                  // headerTitleStyle: {borderColor: 'white', borderWidth: 0},
                  // headerTintColor:
                  // useColorScheme() === 'dark' ? '#ffffff' : 'black',
                }}
              />
              <Stack.Screen
                name="Main"
                component={MainScreen}
                options={{
                  headerShown: false,
                  // headerTitleAlign: 'center',
                  // title: 'Blacash',
                  // headerStyle: [
                  //   useColorScheme() === 'dark'
                  //     ? styles.darkBackgroundColor
                  //     : styles.lightBackgroundColor,
                  //   {borderWidth: 0},
                  // ],
                  // headerTitleStyle: {borderColor: 'white', borderWidth: 0},
                  // headerTintColor:
                  //   useColorScheme() === 'dark' ? '#ffffff' : 'black',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </PreferencesContext.Provider>
      <Toast config={toastConfig} />
    </>
  );
}
