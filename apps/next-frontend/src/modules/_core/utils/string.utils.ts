export const capitalizeString = (str = '') =>
	str.length <= 1 ? str.toUpperCase() : str.charAt(0).toUpperCase() + str.slice(1);

export const stringToArray = (str: string, delimeter: string = ','): string[] =>
	str.split(delimeter).map((item) => item.trim());

export const stringToSqlIdentifier = (prepareString: string) =>
	prepareString.includes('"') ? prepareString : `"${prepareString}"`;
