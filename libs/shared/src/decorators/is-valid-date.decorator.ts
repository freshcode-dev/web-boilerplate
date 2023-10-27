import {
	registerDecorator,
	ValidationOptions,
	isDateString,
	isDate,
	buildMessage
} from 'class-validator';

export const IS_VALID_DATE = 'isValidDateCustom';

export function IsValidDate(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: IS_VALID_DATE,
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(value: unknown): Promise<boolean> | boolean {
					if (typeof value === 'string') {
						return isDateString(value);
					}

					return isDate(value);
				},
				defaultMessage: buildMessage(
					eachPrefix => eachPrefix + '$property must be a valid ISO 8601 date string or date instance',
					validationOptions
				)
			}
		});
	};
}
