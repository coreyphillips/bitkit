import React, { JSX, memo } from 'react';

import PINNavigation from './PINNavigation';
import ReceivedTransaction from './ReceivedTransaction';
import SendNavigation from './SendNavigation';

const BottomSheets = (): JSX.Element => {
	return (
		<>
			<ReceivedTransaction />
			<PINNavigation />
			<SendNavigation />
		</>
	);
};

export default memo(BottomSheets);
