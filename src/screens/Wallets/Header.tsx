import { useNavigation } from '@react-navigation/native';
import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import AppStatus from '../../components/AppStatus';
import { DrawerStackNavigationProp } from '../../navigation/root/DrawerNavigator';
import { Pressable } from '../../styles/components';
import { BurgerIcon } from '../../styles/icons';
import { Title } from '../../styles/text';

const Header = ({ style }: { style?: StyleProp<ViewStyle> }): ReactElement => {
	const navigation = useNavigation<DrawerStackNavigationProp>();
	const { t } = useTranslation('wallet');

	const openAppStatus = (): void => {
		navigation.navigate('Settings', { screen: 'AppStatus' });
	};

	const openDrawer = (): void => {
		navigation.openDrawer();
	};

	return (
		<View style={[styles.container, style]}>
			<View style={styles.leftColumn}>
				<Title testID="WalletHeader">{t('wallet_title')}</Title>
			</View>
			<View style={styles.rightColumn}>
				<AppStatus
					style={styles.appStatus}
					hitSlop={{ top: 15, bottom: 15, left: 5, right: 5 }}
					testID="HeaderAppStatus"
					onPress={openAppStatus}
				/>
				<Pressable
					style={styles.menuIcon}
					hitSlop={{ top: 15, bottom: 15, left: 5, right: 5 }}
					testID="HeaderMenu"
					onPressIn={openDrawer}>
					<BurgerIcon width={24} height={24} />
				</Pressable>
			</View>
		</View>
	);
};

export const HEADER_HEIGHT = 46;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		height: HEADER_HEIGHT,
	},
	leftColumn: {
		flex: 6,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 16,
	},
	rightColumn: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	appStatus: {
		marginRight: 4,
	},
	menuIcon: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 10,
		paddingRight: 16,
	},
});

export default memo(Header, () => true);
