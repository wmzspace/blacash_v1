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

export const AccountScreen = () => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <View>
      <Text>!</Text>
      <List.Section title="List1">
        <List.Accordion title="uncontrolled list" expanded={!expanded}>
          <List.Item title="Item1-1" />
          <List.Item title="Item1-2" />
        </List.Accordion>

        <List.Accordion title="controlled list" expanded={expanded}>
          <List.Item title="Item1-1" />
          <List.Item title="Item1-2" />
        </List.Accordion>
      </List.Section>
      <Button
        onPress={() => {
          setExpanded(!expanded);
        }}>
        {' '}
        Switch Expanded
      </Button>
    </View>
  );
};
