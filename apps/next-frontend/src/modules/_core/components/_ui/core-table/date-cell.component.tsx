import React, { FC, memo } from "react";
import { SxProps, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { formatDate, FormatDateProps } from '@/modules/_core/utils/date.utils';

interface DateCellProps extends FormatDateProps {
	date?: Date | string | number | null;
	sx?: SxProps<Theme>;
}

export const DateCell: FC<DateCellProps> = memo((props) => {
	const { date, sx, ...formatProps } = props;

	useTranslation();

	return (
		<Typography variant="label" sx={sx}>
			{date ? formatDate(date, formatProps) : '—'}
		</Typography>
	);
});
