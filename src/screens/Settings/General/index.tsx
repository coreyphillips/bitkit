import React, { memo, ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { EItemType, IListData, ItemData } from '../../../components/List';
import { useAppSelector } from '../../../hooks/redux';
import type { SettingsScreenProps } from '../../../navigation/types';
import {
	selectedCurrencySelector,
	transactionSpeedSelector,
	unitSelector,
} from '../../../store/reselect/settings';
import { EUnit } from '../../../store/types/wallet';
import SettingsView from './../SettingsView';

const GeneralSettings = ({
	navigation,
}: SettingsScreenProps<'GeneralSettings'>): ReactElement => {
	const { t } = useTranslation('settings');
	const selectedTransactionSpeed = useAppSelector(transactionSpeedSelector);
	const selectedCurrency = useAppSelector(selectedCurrencySelector);
	const selectedUnit = useAppSelector(unitSelector);

	const listData: IListData[] = useMemo(() => {
		const transactionSpeeds = {
			slow: t('fee.slow.value'),
			normal: t('fee.normal.value'),
			fast: t('fee.fast.value'),
			custom: t('fee.custom.value'),
		};

		const data: ItemData[] = [
			{
				title: t('general.currency_local'),
				value: selectedCurrency,
				type: EItemType.button,
				testID: 'CurrenciesSettings',
				onPress: (): void => navigation.navigate('CurrenciesSettings'),
			},
			{
				title: t('general.unit'),
				value:
					selectedUnit === EUnit.BTC
						? t('general.unit_bitcoin')
						: selectedCurrency,
				type: EItemType.button,
				testID: 'UnitSettings',
				onPress: (): void => navigation.navigate('UnitSettings'),
			},
			{
				title: t('general.speed'),
				value: transactionSpeeds[selectedTransactionSpeed],
				type: EItemType.button,
				testID: 'TransactionSpeedSettings',
				onPress: (): void => navigation.navigate('TransactionSpeedSettings'),
			},
			{
				title: t('general.tags'),
				type: EItemType.button,
				testID: 'TagsSettings',
				onPress: (): void => navigation.navigate('TagsSettings'),
			},
		];

		return [{ data }];
	}, [
		selectedCurrency,
		selectedUnit,
		selectedTransactionSpeed,
		navigation,
		t,
	]);

	return <SettingsView title={t('general_title')} listData={listData} />;
};

export default memo(GeneralSettings);
