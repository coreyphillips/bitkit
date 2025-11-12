import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { RecoveryStackScreenProps } from '../../navigation/types';
import { View as ThemedView } from '../../styles/components';
import { BodyM, Display } from '../../styles/text';

const Recovery = ({
	navigation,
}: RecoveryStackScreenProps<'Recovery'>): ReactElement => {
	return (
		<ThemedView style={styles.root}>
			<View style={styles.content}>
				<Display>Recovery</Display>
				<BodyM>Recovery screen placeholder</BodyM>
			</View>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
	content: {
		flex: 1,
		paddingHorizontal: 32,
		paddingTop: 120,
	},
});

export default Recovery;
