import React, {Component} from 'react';
import AppContainer from './src/Route/AppNavigator';
import { Root } from 'native-base';
import GeneralStatusBarColor from './src/Components/StatusBar';

class App extends Component{
  render(){
    return(
      <Root>
        <GeneralStatusBarColor backgroundColor="#0F73CE" barStyle="default"/>
        <AppContainer />
      </Root>      
    )
  }
}
export default App;
