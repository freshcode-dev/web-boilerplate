import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import {
	DateFormatsEnum,
	HourFormatsEnum,
	MinuteFormatsEnum,
	MonthFormatsEnum,
	TimeFormatsEnum,
	YearFormatsEnum
} from './date-fns.utils';
import { capitalizeString } from '@/modules/_core/utils/string.utils';

export interface FormatDateProps {
	showTime?: boolean;
	timeWithPM?: boolean;
	shortYear?: boolean;
	shortMonth?: boolean;
	omitMonthSeparator?: boolean;
	dotSeparatedDate?: boolean;
	shortDateSeparator?: string;
	shortDateSwapDayAndMonth?: boolean;
	timezone?: string
}

// eslint-disable-next-line complexity
export const formatDate = (date?: Date | number | null | string, props?: FormatDateProps): string => {
	const {
		showTime,
		timeWithPM,
		shortYear,
		shortMonth,
		dotSeparatedDate,
		shortDateSeparator = '.',
		omitMonthSeparator,
		shortDateSwapDayAndMonth,
		timezone
	} = props ?? {};

	if (!date) {
		return '';
	}

	let preparedDate;

	if (typeof date === 'string') {
		preparedDate = new Date(date);
	} else {
		preparedDate = timezone ? utcToZonedTime(date, timezone) : date;
	}

	const yearFormat = shortYear ? YearFormatsEnum.TwoNumber : YearFormatsEnum.FullYear;

	const monthFormat =
		shortMonth || dotSeparatedDate
			? dotSeparatedDate
				? MonthFormatsEnum.Number01To12
				: MonthFormatsEnum.Jan
			: MonthFormatsEnum.January;
	const monthSeparator = !shortMonth && !omitMonthSeparator ? ',' : '';
	const monthValue = format(preparedDate, monthFormat);
	const capitalizedMonth = capitalizeString(monthValue);

	const timeFormat = timeWithPM
		? TimeFormatsEnum.LongLocalizedTime
		: `${HourFormatsEnum.Number00To23}:${MinuteFormatsEnum.Number0}`;
	const timeSeparator = ',';
	const timeValue = showTime ? format(preparedDate, `${timeSeparator} ${timeFormat}`) : '';

	const dayFormat = dotSeparatedDate ? DateFormatsEnum.Number01 : DateFormatsEnum.Number1;

	const dayMonthPart = shortDateSwapDayAndMonth
		? `'${monthValue}'${shortDateSeparator}${dayFormat}`
		: `${dayFormat}${shortDateSeparator}'${monthValue}'`;

	const pattern = dotSeparatedDate
		? `${dayMonthPart}${shortDateSeparator}${yearFormat}${timeValue ? `'${timeValue}'` : ''}`
		: `${dayFormat} '${capitalizedMonth}'${monthSeparator} ${yearFormat} ${timeValue ? `'${timeValue}'` : ''}`;

	return format(preparedDate, pattern);
};

export const getShortDate = (date?: Date | number | null | string, props?: FormatDateProps): string =>
	formatDate(date, {
		...props,
		dotSeparatedDate: props?.dotSeparatedDate ?? true,
		shortYear: props?.shortYear ?? true,
	});

export const getMMDDString = (date?: Date | string | number): string =>
	getShortDate(date, {
		shortDateSeparator: '/',
		shortYear: false,
		shortDateSwapDayAndMonth: true,
	});

export const compareDates = (options: {
	date1: Date | string | number;
	date2?: Date | string | number;
	operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
}): boolean => {
	const { date1, date2, operator } = options;

	const d1 = new Date(date1);
	const d2 = date2 ? new Date(date2) : new Date();

	switch (operator) {
		case 'eq':
			return d1.getTime() === d2.getTime();
		case 'gt':
			return d1.getTime() > d2.getTime();
		case 'lt':
			return d1.getTime() < d2.getTime();
		case 'gte':
			return d1.getTime() >= d2.getTime();
		case 'lte':
			return d1.getTime() <= d2.getTime();
		default:
			return false;
	}
};

export const getZonedFormatDate = (date?: Date, props?: FormatDateProps): Date | string => {
	const { timezone } = props ?? {};

	if (!date) {
		return '';
	}

	const zonedDate = timezone ? utcToZonedTime(date, timezone) : date;

	return zonedDate;
}
