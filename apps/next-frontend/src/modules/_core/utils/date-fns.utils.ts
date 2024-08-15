// Format helpers for date-fns/format function

export enum HourFormatsEnum {
	// Hour [1-12]
	Number1To12 = 'h',
	First1To12 = 'ho',
	Number01To12 = 'hh',

	// Hour [0-23]
	Number0To23 = 'H',
	First0To23 = 'Ho',
	Number00To23 = 'HH',

	// Hour [0-11]
	Number0To11 = 'K',
	First0To11 = 'Ko',
	Number01To11And00 = 'KK',

	// Hour [1-24]
	Number1To24 = 'k',
	First1To24 = 'ko',
	Number01To24 = 'kk',
}

export enum MinuteFormatsEnum {
	Number = 'm',
	First = 'mo',
	Number0 = 'mm',
}

export enum SecondFormatsEnum {
	Number0To59 = 's',
	Number00To59 = 'ss',
	First0To59 = 'so',
}

export enum TimeFormatsEnum {
	LongLocalizedTime = 'p',
	LongLocalizedTimeWithSeconds = 'pp',
	LongLocalizedTimeWithSecondsAndShortTimezone = 'ppp',
	LongLocalizedTimeWithSecondsAndFullTimezone = 'pppp',
}

export enum PartOfDayFormatsEnum {
	PM = 'a',
	pm = 'aaaa',
	p = 'aaaaa',
	PM_midnight = 'b',
	pm_midnight = 'bbbb',
	p_mi = 'bbbbb',
	at_night = 'BBBB'
}

export enum DayOfWeekFormatsEnum {
	Mon = 'EEE',
	Monday = 'EEEE',
}

export enum DateFormatsEnum {
	Number1 = 'd',
	Number01 = 'dd',
	First = 'do',
}

export enum MonthFormatsEnum {
	Number1To12 = 'M',
	Number01To12 = 'MM',
	First = 'Mo',
	Jan = 'MMM',
	January = 'MMMM',
}

export enum YearFormatsEnum {
	TwoNumber = 'yy',
	FullYear = 'yyyy',
}

export enum DayOfYearFormatsEnum {
	Number1 = 'D',
	First = 'Do',
	Number01 = 'DD',
	Number001 = 'DDD',
}
