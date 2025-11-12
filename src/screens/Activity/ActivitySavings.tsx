import React, { ReactElement, memo, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';

import ActivityHeader from '../../components/ActivityHeader';
import Money from '../../components/Money';
import NavigationHeader from '../../components/NavigationHeader';
import SafeAreaInset from '../../components/SafeAreaInset';
import WalletOnboarding from '../../components/WalletOnboarding';
import Button from '../../components/buttons/Button';
import { useAppSelector } from '../../hooks/redux';
import { useBalance } from '../../hooks/wallet';
import { WalletScreenProps } from '../../navigation/types';
import { activityItemsSelector } from '../../store/reselect/activity';
import { EActivityType } from '../../store/types/activity';
import { View as ThemedView } from '../../styles/components';
import { BitcoinCircleIcon } from '../../styles/icons';
import { CaptionB, Display } from '../../styles/text';
import ActivityList from './ActivityList';

const imageSrc = require('../../assets/illustrations/piggybank.png');

const ActivitySavings = ({}: WalletScreenProps<'ActivitySavings'>): ReactElement => {
	const { t } = useTranslation('wallet');
	const { onchainBalance } = useBalance();
	const items = useAppSelector(activityItemsSelector);

	const savingsItems = useMemo(() => {
		return items.filter((item) => {
			return item.activityType === EActivityType.onchain;
		});
	}, [items]);

	const filter = useMemo(() => {
		return {
			types: [EActivityType.onchain],
			includeTransfers: false,
		};
	}, []);

	const showOnboarding = onchainBalance === 0 && savingsItems.length === 0;

	return (
		<ThemedView style={styles.root}>
			<SafeAreaInset type="top" />
			<NavigationHeader
				title={t('savings.title')}
				icon={<BitcoinCircleIcon width={32} height={32} />}
				showCloseButton={false}
			/>

			<View style={styles.imageContainer} pointerEvents="none">
				<Image style={styles.image} source={imageSrc} />
			</View>

			<View style={styles.content}>
				<ActivityHeader balance={onchainBalance} />

				<View style={styles.divider} />

				{showOnboarding ? (
					<WalletOnboarding
						text={
							<Trans
								t={t}
								i18nKey="savings.onboarding"
								components={{ accent: <Display color="brand" /> }}
							/>
						}
					/>
				) : (
					<View style={styles.activity}>
						<ActivityList filter={filter} showFooterButton={true} />
					</View>
				)}
			</View>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
	imageContainer: {
		position: 'absolute',
		top: 8,
		right: -124,
		zIndex: 1,
	},
	image: {
		width: 268,
		height: 268,
	},
	content: {
		flex: 1,
		paddingTop: 16,
		paddingHorizontal: 16,
	},
	transfer: {
		flexDirection: 'row',
		paddingTop: 4,
		paddingBottom: 10,
	},
	transferText: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	transferIcon: {
		marginRight: 3,
	},
	divider: {
		borderTopColor: 'rgba(255, 255, 255, 0.1)',
		borderTopWidth: 1,
		marginTop: 8,
	},
	button: {
		marginTop: 16,
	},
	activity: {
		flex: 1,
	},
});

export default memo(ActivitySavings);
