import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import AppStatus from '../../components/AppStatus';
import colors from '../../styles/colors';
import { View as ThemedView } from '../../styles/components';
import {
	ActivityIcon,
	CoinsIcon,
	SettingsIcon,
} from '../../styles/icons';
import { DrawerText } from '../../styles/text';
import { DrawerStackNavigationProp } from './DrawerNavigator';

type DrawerItemProps = {
	icon: ReactElement;
	label: string;
	testID?: string;
	onPress: () => void;
};

const DrawerItem = ({
	icon,
	label,
	testID,
	onPress,
}: DrawerItemProps): ReactElement => (
	<Pressable
		style={styles.drawerItem}
		hitSlop={{ left: 16, right: 16 }}
		testID={testID}
		onPress={onPress}>
		<View style={styles.drawerItemIcon}>{icon}</View>
		<DrawerText style={styles.drawerItemLabel}>{label}</DrawerText>
	</Pressable>
);

const DrawerContent = (props: DrawerContentComponentProps): ReactElement => {
	const { t } = useTranslation('wallet');
	const navigation = useNavigation<DrawerStackNavigationProp>();

	return (
		<ThemedView style={[styles.drawer]} color="brand">
			<DrawerContentScrollView
				contentContainerStyle={styles.drawerContent}
				bounces={false}
				{...props}>
				<DrawerItem
					icon={<CoinsIcon color="white" width={24} height={24} />}
					label={t('drawer.wallet')}
					testID="DrawerWallet"
					onPress={() => navigation.navigate('Wallet')}
				/>
				<DrawerItem
					icon={<ActivityIcon color="white" width={24} height={24} />}
					label={t('drawer.activity')}
					testID="DrawerActivity"
					onPress={() => {
						navigation.navigate('Wallet', { screen: 'ActivitySavings' });
					}}
				/>
				<DrawerItem
					icon={<SettingsIcon color="white" width={24} height={24} />}
					label={t('drawer.settings')}
					testID="DrawerSettings"
					onPress={() => {
						navigation.navigate('Settings', { screen: 'MainSettings' });
					}}
				/>

				<AppStatus
					style={styles.appStatus}
					showText={true}
					showReady={true}
					color="black"
					testID="DrawerAppStatus"
					onPress={() => {
						navigation.navigate('Settings', { screen: 'AppStatus' });
					}}
				/>
			</DrawerContentScrollView>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	drawer: {
		flex: 1,
	},
	drawerContent: {
		flex: 1,
		paddingStart: 16,
		paddingEnd: 16,
	},
	drawerItem: {
		borderBottomWidth: 1,
		borderBottomColor: colors.white10,
		flexDirection: 'row',
		alignItems: 'center',
		height: 56,
	},
	drawerItemIcon: {
		width: 24,
		height: 24,
		marginRight: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	drawerItemLabel: {
		textTransform: 'uppercase',
	},
	appStatus: {
		marginTop: 'auto',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
	},
});

export default DrawerContent;
