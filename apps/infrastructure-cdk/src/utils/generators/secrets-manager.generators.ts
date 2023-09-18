import { Stack } from 'aws-cdk-lib';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

export type SecretContentType = Record<string, string | number | boolean>;
export type SecretWithPasswordProps = {
	secretName: string;
	staticContent: SecretContentType;
	passwordKey: string;
};

export const defineSecretWithGeneratedPassword = (stack: Stack, props: SecretWithPasswordProps) => (
	new Secret(stack, props.secretName, {
		secretName: props.secretName,
		description: 'Stores generated password value',
		generateSecretString: {
			secretStringTemplate: JSON.stringify(props.staticContent),
			generateStringKey: props.passwordKey,
			passwordLength: 26,
			excludePunctuation: true,
			excludeLowercase: false,
			excludeNumbers: false,
			includeSpace: false,
			excludeUppercase: false
		}
	})
);
