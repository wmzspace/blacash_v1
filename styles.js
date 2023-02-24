import {Dimensions, StyleSheet, NativeModules} from 'react-native';
let deviceHeight =
  Dimensions.get('window').height / Dimensions.get('window').width > 1.8
    ? Dimensions.get('window').height + NativeModules.StatusBarManager.HEIGHT
    : Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width,
    height: deviceHeight,
  },
  innerContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineFlex: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  button2: {
    alignItems: 'center',
    paddingHorizontal: 35,
    paddingVertical: 10,
    marginBottom: 23,
    margin: 25,
    borderRadius: 10,
  },
  button: {
    alignItems: 'center',
    paddingHorizontal: 90,
    paddingVertical: 10,
    marginBottom: 23,
    margin: 25,
    borderRadius: 10,
  },
  disabledButton: {
    alignItems: 'center',
    paddingHorizontal: 90,
    paddingVertical: 10,
    marginBottom: 23,
    margin: 25,
    borderRadius: 10,
    backgroundColor: 'lightgray',
  },
  lightBackgroundColor: {
    backgroundColor: '#fcfcfc',
  },
  darkBackgroundColor: {
    backgroundColor: '#181818',
  },
  lightColor: {
    color: '#fcfcfc',
  },
  darkColor: {
    color: 'black',
  },
  lightTheme: {
    backgroundColor: '#fcfcfc',
    color: 'black',
  },
  darkTheme: {
    backgroundColor: '#181818',
    color: '#fcfcfc',
  },
});

export default styles;
