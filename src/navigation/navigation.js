import { StackNavigator, TabNavigator } from 'react-navigation';

import AuthScreen from '../screens/authScreen';
import ChatScreen from '../screens/chatScreen';
import MapScreen from '../screens/mapScreen';
import DeckScreen from '../screens/deckScreen';
import ListScreen from '../screens/listScreen';
import ProfileScreen from '../screens/profileScreen';
import SettingScreen from '../screens/settingScreen';
import RegScreen from '../screens/regScreen';
import notificationSettingScreen from '../screens/notificationSettingScreen';
import displayScreen from '../screens/displayScreen';
import editProfileScreen from '../screens/EditProfile'
/*const chatNavigator = StackNavigator({
  list: { screen: ListScreen },
  chat: { screen: ChatScreen }
},
{
  headerMode: 'None',
  navigationOptions: {
    headerVisible: false
  }
});

const settingNavigator = StackNavigator({
  profile: { screen: ProfileScreen },
  setting: { screen: SettingScreen}
},
{
  headerMode: 'None',
  navigationOptions: {
    headerVisible: false
  }
});*/

const mainNavigator = TabNavigator(
  {
    map: { screen: MapScreen },
    deck: { screen: DeckScreen },
    list: { screen: ListScreen },
    profile: { screen: ProfileScreen }
  },
  {
    tabBarPosition: 'bottom'
  }
);

const welcomeNavigator = StackNavigator({
  auth: { screen: AuthScreen },
  reg: { screen: RegScreen },
  main: {
    screen: mainNavigator,
    navigationOptions: {
      headerLeft: null
    }
  },
  setting: { screen: SettingScreen },
  notification: { screen: notificationSettingScreen },
  display: { screen: displayScreen},
  chat: { screen: ChatScreen },
  editProfile: {screen: editProfileScreen }
});

export default welcomeNavigator;
