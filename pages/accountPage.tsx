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
  const [expanded, setExpanded] = React.useState(false);
  return (
    <View>
      <Text>!</Text>
      {/*<List.Section title="">*/}
      <List.Accordion
        title="注册信息"
        expanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
        }}>
        <List.Item title="用户名:" description={userInfo.name} />
        <List.Item title="邮箱:" description={userInfo.email} />
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
