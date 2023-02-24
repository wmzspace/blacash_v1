import * as React from 'react';
import {StatusBar, View, Dimensions} from 'react-native';

export class StatusBarComp extends React.Component {
  render() {
    const {
      isDarkStyle = false,
      statusBarBgColor = 'transparent',
      hidden = false,
      translucent = Dimensions.get('window').height /
        Dimensions.get('window').width >
        1.8,
    } = this.props;
    return (
      <View style={{backgroundColor: statusBarBgColor}}>
        <StatusBar
          translucent={translucent}
          backgroundColor={statusBarBgColor}
          barStyle={isDarkStyle ? 'light-content' : 'dark-content'}
          hidden={hidden}
        />
      </View>
    );
  }
}

// const StatusBarComp = props => {
//   const {
//     isDarkStyle = false,
//     statusBarBgColor = 'transparent',
//     hidden = false,
//     translucent = Dimensions.get('window').height /
//       Dimensions.get('window').width >
//       1.8,
//   } = props;
//   return (
//     <View style={{backgroundColor: statusBarBgColor}}>
//       <StatusBar
//         translucent={translucent}
//         backgroundColor={statusBarBgColor}
//         barStyle={isDarkStyle ? 'light-content' : 'dark-content'}
//         hidden={hidden}
//       />
//     </View>
//   );
// };
