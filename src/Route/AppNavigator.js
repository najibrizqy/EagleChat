import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { Icon } from 'native-base';
import { createStackNavigator } from 'react-navigation-stack';

import Signin from '../Screens/AuthScreens/Signin';
import Signup from '../Screens/AuthScreens/Signup';
import Home from '../Screens/AppScreens/Home';
import ChatRoom from '../Screens/AppScreens/ChatRoom';

import Splash from '../Screens/Splash';

const AuthStack = createStackNavigator({
    SigninScreen: {
      screen: Signin,
    },
    SignupScreen:{
      screen: Signup,
    },
  },{
      defaultNavigationOptions: {
        header: null
      }
  });
  
  const AppStack = createStackNavigator({
    HomeScreen:{
      screen: Home,
    },
    ChatRoom:{
      screen: ChatRoom
    }
  },{
    headerMode: "none"
  });
  
  const AppNavigator = createSwitchNavigator({
    Auth: AuthStack,
    App: AppStack
  },{
    initialRouteName: 'Auth'
  })

  const InitialNavigation = createSwitchNavigator(
    {
        Splash: { screen: Splash },
        AppNavigator: { screen: AppNavigator }
    }
)

export default AppContainer = createAppContainer(InitialNavigation);