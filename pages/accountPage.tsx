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
import {Searchbar, Text, List, Button} from 'react-native-paper';
import ScreenWrapper from '../@components/ScreenWrapper';
import {globalVal, userInfo} from '../values/global';
import {getNftImgs} from '../apis/api';
import styles from '../styles';

export const AccountScreen = () => {
  const [expanded1, setExpanded1] = React.useState(false);
  const [expanded2, setExpanded2] = React.useState(false);
  return (
    <View style={[styles.container, {padding: 10}]}>
      {/*<List.Section title="">*/}
      <List.Accordion
        title="注册信息"
        expanded={expanded1}
        onPress={() => {
          setExpanded1(!expanded1);
        }}>
        <List.Item title="用户名: " description={userInfo?.name} />
        <List.Item title="邮箱: " description={userInfo?.email} />
        <List.Item title="定位: " description={userInfo?.location} />
      </List.Accordion>
      <List.Accordion
        title="账户信息"
        expanded={expanded2}
        onPress={() => {
          setExpanded2(!expanded2);
        }}>
        <List.Item title="钱包余额:" description={userInfo?.coin} />
        <List.Item title="钱包地址:" description={userInfo?.address} />
      </List.Accordion>

      {/*<List.Accordion title="controlled list" expanded={expanded}>*/}
      {/*  <List.Item title="Item1-1" />*/}
      {/*  <List.Item title="Item1-2" />*/}
      {/*</List.Accordion>*/}
      {/*</List.Section>*/}
      {/*<Button*/}
      {/*  onPress={() => {*/}
      {/*    setExpanded(!expanded);*/}
      {/*  }}>*/}
      {/*  {' '}*/}
      {/*  Switch Expanded*/}
      {/*</Button>*/}
    </View>
  );
};
