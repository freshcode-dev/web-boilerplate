import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function MatchField(property: string, validationOptions?: ValidationOptions) {
	return (object: object, propertyName: string) => {
		registerDecorator({
			name: 'MatchField',
			target: object.constructor,
			propertyName,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints as [string];

					const relatedValue: unknown = (args.object as Record<string, any>)[relatedPropertyName];

					return value === relatedValue;
				},

				defaultMessage(args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints as [string];

					return `${propertyName} must match ${relatedPropertyName} exactly`;
				},
			},
		});
	};
}
