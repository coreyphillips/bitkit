import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { memo, ReactElement } from 'react';

import InactivityTracker from './components/InactivityTracker';
import { useAppStateHandler } from './hooks/useAppStateHandler';
import { useNetworkConnectivity } from './hooks/useNetworkConnectivity';
import DrawerNavigator from './navigation/root/DrawerNavigator';
import RootNavigationContainer from './navigation/root/RootNavigationContainer';
import { SheetRefsProvider } from './sheets/SheetRefsProvider';

const AppOnboarded = (): ReactElement => {
	useAppStateHandler();
	useNetworkConnectivity();

	return (
		<SheetRefsProvider>
			<InactivityTracker>
				<RootNavigationContainer>
					<BottomSheetModalProvider>
						<DrawerNavigator />
					</BottomSheetModalProvider>
				</RootNavigationContainer>
			</InactivityTracker>
		</SheetRefsProvider>
	);
};

export default memo(AppOnboarded);
