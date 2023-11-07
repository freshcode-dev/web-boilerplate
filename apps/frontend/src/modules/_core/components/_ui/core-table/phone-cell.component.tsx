import { FC, memo } from "react";
import { formatPhoneNumberIntl } from 'react-phone-number-input';

interface PhoneCellProps {
	phone: string;
}

const PhoneCell: FC<PhoneCellProps> = (props) => {
	const { phone } = props;

	return (
		<>
			{formatPhoneNumberIntl(phone)}
		</>
	);
};

export default memo(PhoneCell);
