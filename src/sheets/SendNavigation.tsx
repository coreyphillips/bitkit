import {
	NavigationIndependentTree,
	createNavigationContainerRef,
} from '@react-navigation/native';
import {
	NativeStackNavigationOptions,
	NativeStackNavigationProp,
	createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React, { ReactElement, memo } from 'react';

import BottomSheet from '../components/BottomSheet';
import { __E2E__ } from '../constants/env';
import { useAppSelector } from '../hooks/redux';
import Address from '../screens/Wallets/Send/Address';
import AutoRebalance from '../screens/Wallets/Send/AutoRebalance';
import CoinSelection from '../screens/Wallets/Send/CoinSelection';
import ErrorScreen from '../screens/Wallets/Send/Error';
import FeeCustom from '../screens/Wallets/Send/FeeCustom';
import FeeRate from '../screens/Wallets/Send/FeeRate';
import Pending from '../screens/Wallets/Send/Pending';
import PinCheck from '../screens/Wallets/Send/PinCheck';
import Scanner from '../screens/Wallets/Send/Scanner';
import Success from '../screens/Wallets/Send/Success';
import {
	setupFeeForOnChainTransaction,
	setupOnChainTransaction,
} from '../store/actions/wallet';
import {
	selectedNetworkSelector,
	selectedWalletSelector,
	transactionSelector,
} from '../store/reselect/wallet';
import { EActivityType } from '../store/types/activity';
import { updateOnchainFeeEstimates } from '../store/utils/fees';
import BottomSheetNavigationContainer from './BottomSheetNavigationContainer';

export type SendNavigationProp = NativeStackNavigationProp<SendStackParamList>;

export type SendStackParamList = {
	Address: undefined;
	AutoRebalance: undefined;
	CoinSelection: undefined;
	ErrorScreen: undefined;
	FeeCustom: undefined;
	FeeRate: undefined;
	Pending: undefined;
	PinCheck: undefined;
	Scanner: undefined;
	Success: undefined;
};

const navigationRef = createNavigationContainerRef<SendStackParamList>();

const Stack = createNativeStackNavigator<SendStackParamList>();

const screenOptions: NativeStackNavigationOptions = {
	headerShown: false,
	animation: __E2E__ ? 'none' : 'default',
};

const SendNavigation = (): ReactElement => {
	const selectedWallet = useAppSelector(selectedWalletSelector);
	const selectedNetwork = useAppSelector(selectedNetworkSelector);
	const transaction = useAppSelector(transactionSelector);

	return (
		<BottomSheet
			name="sendNavigation"
			enablePanDownToClose={false}
			enableDismissOnClose={true}
			snapPoints={['100%']}
			onOpen={async (): Promise<void> => {
				await updateOnchainFeeEstimates();
				await setupFeeForOnChainTransaction();
			}}
			onClose={(): void => {
				navigationRef.current?.navigate('Address');
			}}
			navigationChildren={
				<NavigationIndependentTree>
					<BottomSheetNavigationContainer ref={navigationRef}>
						<Stack.Navigator screenOptions={screenOptions}>
							<Stack.Screen name="Address" component={Address} />
							<Stack.Screen name="Scanner" component={Scanner} />
							<Stack.Screen name="FeeRate" component={FeeRate} />
							<Stack.Screen name="FeeCustom" component={FeeCustom} />
							<Stack.Screen name="CoinSelection" component={CoinSelection} />
							<Stack.Screen name="AutoRebalance" component={AutoRebalance} />
							<Stack.Screen name="PinCheck" component={PinCheck} />
							<Stack.Screen name="Pending" component={Pending} />
							<Stack.Screen name="Success" component={Success} />
							<Stack.Screen name="ErrorScreen" component={ErrorScreen} />
						</Stack.Navigator>
					</BottomSheetNavigationContainer>
				</NavigationIndependentTree>
			}
		/>
	);
};

export default memo(SendNavigation);
