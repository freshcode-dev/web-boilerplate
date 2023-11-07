import { FC, memo } from "react";
import { formatPhoneNumberIntl } from 'react-phone-number-input';

interface PhoneCellProps {
	phone: string;
}

export const PhoneCell: FC<PhoneCellProps> = memo((props) => {
	const { phone } = props;

	return (
		<>
			{formatPhoneNumberIntl(phone)}
		</>
	);
});
