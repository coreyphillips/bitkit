import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { IActivityItem } from '../../store/types/activity';
import { BodyS } from '../../styles/text';

export const ListItem = ({
	item,
}: {
	item: IActivityItem;
}): ReactElement => {
	return (
		<View style={styles.container}>
			<BodyS>{item.id}</BodyS>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#333',
	},
});

export default ListItem;
