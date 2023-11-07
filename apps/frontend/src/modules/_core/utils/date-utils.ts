import { format } from 'date-fns';

export interface FormatDateProps {
	time?: boolean;
	shortYear?: boolean;
	shortMonth?: boolean;
	omitMonthSeparator?: boolean;
}

export const formatDate = (
	date?: Date | number | null | string,
	props?: FormatDateProps
): string => {
	const { time, shortYear, shortMonth, omitMonthSeparator } = props ?? {};

	if (!date) {
		return '';
	}

	let preparedDate;

	if (typeof date === 'string') {
		preparedDate = new Date(date);
	} else {
		preparedDate = date;
	}

	const yearFormat = !shortYear ? 'yyyy' : 'yy';
	const monthFormat = !shortMonth ? 'MMMM' : 'MMM';
	const monthSeparator = !shortMonth && !omitMonthSeparator ? ',' : '';

	const month = format(preparedDate, monthFormat);
	const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

	const pattern = `d '${capitalizedMonth}'${monthSeparator} ${yearFormat}${time ? ', p' : ''}`;

	return format(preparedDate, pattern);
};

export type RelativeTimeFormatUnit = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';
export const getRelativeTime = (d1: Date, d2 = new Date(), locale = 'en'): string => {
	const units: Record<RelativeTimeFormatUnit, number> = {
		year: 24 * 60 * 60 * 1000 * 365,
		month: 24 * 60 * 60 * 1000 * 365 / 12,
		day: 24 * 60 * 60 * 1000,
		hour: 60 * 60 * 1000,
		minute: 60 * 1000,
		second: 1000,
	};

	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

	const elapsed = new Date(d1).getTime() - new Date(d2).getTime();

	for (const u in units) {
		if (Math.abs(elapsed) > units[u as RelativeTimeFormatUnit]) {
			return rtf.format(Math.round(elapsed / units[u as RelativeTimeFormatUnit]), u as RelativeTimeFormatUnit);
		}
	}

	return rtf.format(Math.round(elapsed / units.second), 'second');
};
