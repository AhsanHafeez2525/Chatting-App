// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './screens/Signin';
import signup from './screens/Signup';
import MainScreen from './screens/MainScreen';

import CreatePrfoile from './screens/CreateProfile';
import ViewProfile from './screens/ViewProfile';
import UpdateProfile from './screens/CreateProfile';
import ViewUsers from './screens/ViewUsers';
import ForgetPassword from './screens/ForgetPassword';
import MapScreen from './screens/MapScreen';
import ChatScreen from './screens/ChatScreen';
import IndividualChatScreen from './screens/IndividualChatScreen';
import UsersList from './screens/UsersList';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Signup" component={signup} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="Create Profile" component={CreatePrfoile} />
        <Stack.Screen name="View Profile" component={ViewProfile} />
        <Stack.Screen name="Update Profile" component={UpdateProfile} />
        <Stack.Screen name="View Users" component={ViewUsers} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="Maps" component={MapScreen} />
        <Stack.Screen name="Users" component={UsersList} />
        <Stack.Screen name="IndividualChatScreen" component={IndividualChatScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;