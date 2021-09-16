import 'react-native-gesture-handler';
import React from 'react';
import BottonTab from './Navigation/Navigation';
import { Provider } from "react-redux";
import Store from './Store/configureStore';

export default function App() {
  return (
    <Provider store={Store} >
      <BottonTab />
    </Provider>
  )
}