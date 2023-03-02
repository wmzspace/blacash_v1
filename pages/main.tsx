// TODO: 0没审的，1审过没出售的，2正在出售所有权，3正在出售使用权

import * as React from 'react';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  Platform,
  Easing,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Appbar,
  BottomNavigation,
  Menu,
  Searchbar,
  Switch,
  useTheme,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StatusBarComp} from '../@components/StatusBarComp';
import {PreferencesContext} from '../context/preference';
import {serverIPP} from '../values/strings';

import ScreenWrapper from '../@components/ScreenWrapper';
import type {StackNavigationProp} from '@react-navigation/stack';
// import {PhotoGallery} from './photoGallery';
import {main_styles} from '../ui/main_styles';

type Route = {route: {key: string}};

type RoutesState = Array<{
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon?: string;
  color?: string;
  badge?: boolean;
  getAccessibilityLabel?: string;
  getTestID?: string;
}>;

import {userInfo} from '../values/global';
import {NftGallery} from './nftGallery';
import {OwnedGallery} from './ownedGallery';
import {UploadScreen} from './uploadPage';
import {AccountScreen} from './accountPage';

type Props = {
  navigation: StackNavigationProp<{}>;
};

export const PhotoGallery = ({route}: Route) => {
  const PHOTOS = Array.from({length: 24}).map(
    (_, i) => `https://unsplash.it/300/300/?random&__id=${route.key}${i}`,
  );

  return (
    <ScreenWrapper contentContainerStyle={main_styles.content}>
      {PHOTOS.map(uri => (
        <View key={uri} style={main_styles.item}>
          <Image source={{uri}} style={main_styles.photo} />
        </View>
      ))}
    </ScreenWrapper>
  );
};

const MainScreen = ({route, navigation}) => {
  const {email} = route.params;
  userInfo.email = email;

  const theme = useTheme();
  const {toggleTheme, isThemeDark, toggleThemeStyle, isMD2Theme} =
    React.useContext(PreferencesContext);
  // const {isV3} = useTheme();

  const insets = useSafeAreaInsets();
  const [index, setIndex] = React.useState(0);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [sceneAnimation, setSceneAnimation] =
    React.useState<
      React.ComponentProps<typeof BottomNavigation>['sceneAnimationType']
    >();

  const [routes] = React.useState<RoutesState>([
    {
      key: 'album',
      title: 'Album',
      focusedIcon: 'image-album',
      ...(theme && !isThemeDark && {color: '#2962ff'}),
    },
    {
      key: 'library',
      title: 'Owned',
      focusedIcon: 'inbox',
      badge: true,
      ...(!theme
        ? {unfocusedIcon: 'inbox-outline'}
        : {
            color: '#6200ee',
          }),
    },
    {
      key: 'purchased',
      title: 'Upload',
      focusedIcon: 'upload',
      // focusedIcon: 'shopping',
      ...(!theme ? {unfocusedIcon: 'shopping-outline'} : {color: '#c51162'}),
    },
    {
      key: 'favorites',
      title: 'Account',
      focusedIcon: 'account',
      // focusedIcon: 'heart',
      ...(!theme
        ? {unfocusedIcon: 'heart-outline'}
        : {
            color: '#00796b',
          }),
    },
  ]);

  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  //TODO: Main Page
  return (
    <View style={main_styles.screen}>
      <StatusBarComp isDarkStyle={isThemeDark} />
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="BlaCash" titleStyle={{paddingLeft: 80}} />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon={MORE_ICON}
              onPress={() => setMenuVisible(true)}
              {...(theme && {color: 'white'})}
            />
          }>
          <Menu.Item
            trailingIcon={sceneAnimation === undefined ? 'check' : undefined}
            onPress={() => {
              setSceneAnimation(undefined);
              setMenuVisible(false);
            }}
            title="Scene animation: none"
            // theme={toggleTheme()}
          />
          <Menu.Item
            trailingIcon={sceneAnimation === 'shifting' ? 'check' : undefined}
            onPress={() => {
              setSceneAnimation('shifting');
              setMenuVisible(false);
            }}
            title="Scene animation: shifting"
          />
          <Menu.Item
            trailingIcon={sceneAnimation === 'opacity' ? 'check' : undefined}
            onPress={() => {
              setSceneAnimation('opacity');
              setMenuVisible(false);
            }}
            title="Scene animation: opacity"
          />
        </Menu>
        <Switch
          color={'black'}
          value={isThemeDark}
          onValueChange={toggleTheme}
        />
        {/*<Switch*/}
        {/*  color={'black'}*/}
        {/*  value={isMD2Theme}*/}
        {/*  onValueChange={toggleThemeStyle}*/}
        {/*/>*/}
      </Appbar.Header>
      <BottomNavigation
        safeAreaInsets={{bottom: insets.bottom}}
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        labelMaxFontSizeMultiplier={2}
        renderScene={BottomNavigation.SceneMap({
          album: NftGallery,
          library: OwnedGallery,
          favorites: AccountScreen,
          purchased: UploadScreen,
        })}
        sceneAnimationEnabled={sceneAnimation !== undefined}
        sceneAnimationType={sceneAnimation}
        sceneAnimationEasing={Easing.ease}
        // theme={theme}
      />
    </View>
  );
};

MainScreen.title = 'Bottom Navigation';

export default MainScreen;
