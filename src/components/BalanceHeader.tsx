import React, { memo, ReactElement } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/redux';

import { useBalance, useSwitchUnitAnnounced } from '../hooks/wallet';
import { hideBalanceSelector } from '../store/reselect/settings';
import { updateSettings } from '../store/slices/settings';
import { EyeIcon } from '../styles/icons';
import Money from './Money';

/**
 * Displays the total available balance for the current wallet & network.
 */
const BalanceHeader = (): ReactElement => {
	const dispatch = useAppDispatch();
	const onSwitchUnit = useSwitchUnitAnnounced();
	const { totalBalance } = useBalance();
	const hideBalance = useAppSelector(hideBalanceSelector);

	const toggleHideBalance = (): void => {
		dispatch(updateSettings({ hideBalance: !hideBalance }));
	};

	return (
		<View style={styles.container}>
			<View style={styles.label}>
				<Money
					sats={totalBalance}
					unitType="secondary"
					color="secondary"
					size="caption13Up"
					enableHide={true}
					symbol={true}
				/>
			</View>

			<TouchableOpacity
				style={styles.balance}
				activeOpacity={0.7}
				testID="TotalBalance"
				onPress={onSwitchUnit}>
				<Money sats={totalBalance} enableHide={true} symbol={true} />
				{hideBalance && (
					<TouchableOpacity
						activeOpacity={0.7}
						hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
						testID="ShowBalance"
						onPress={toggleHideBalance}>
						<EyeIcon />
					</TouchableOpacity>
				)}
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 32,
		paddingHorizontal: 16,
	},
	label: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	balance: {
		marginTop: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
});

export default memo(BalanceHeader);
