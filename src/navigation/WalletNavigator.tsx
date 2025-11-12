import {
	NativeStackNavigationOptions,
	NativeStackNavigationProp,
	createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React, { ReactElement } from 'react';

import { __E2E__ } from '../constants/env';
import ActivitySavings from '../screens/Activity/ActivitySavings';
import Home from '../screens/Wallets/Home';

export type WalletStackParamList = {
	Home: undefined;
	ActivitySavings: undefined;
};

export type WalletNavigationProp =
	NativeStackNavigationProp<WalletStackParamList>;

const Stack = createNativeStackNavigator<WalletStackParamList>();
const screenOptions: NativeStackNavigationOptions = {
	headerShown: false,
	animation: __E2E__ ? 'none' : 'default',
};

const WalletStack = (): ReactElement => {
	return (
		<Stack.Navigator screenOptions={screenOptions}>
			<Stack.Screen name="Home" component={Home} />
			<Stack.Screen name="ActivitySavings" component={ActivitySavings} />
		</Stack.Navigator>
	);
};

export default WalletStack;
