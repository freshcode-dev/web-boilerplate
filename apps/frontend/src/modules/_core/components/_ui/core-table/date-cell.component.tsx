import React, { FC, memo } from "react";
import { useTranslation } from "react-i18next";
import { formatDate, FormatDateProps } from "../../../utils/date-utils";
import { SxProps, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';

interface DateCellProps extends FormatDateProps {
	date?: Date | string | number | null;
	sx?: SxProps<Theme>;
}

const DateCell: FC<DateCellProps> = (props) => {
	const { date, sx, ...formatProps } = props;

	useTranslation();

	return (
		<Typography variant="label" sx={sx}>
			{date ? formatDate(date, formatProps) : '—'}
		</Typography>
	);
};

export default memo(DateCell);
