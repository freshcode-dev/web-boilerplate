/* eslint-disable @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports */
const args = require('minimist')(process.argv);
const fs = require('fs');
const path = require('path');
const formatDate = require('date-fns/format');

interface String {
	insertBeforeLastOccurrence(strToFind: string, strToInsert: string): string;
}

String.prototype.insertBeforeLastOccurrence = function (strToFind: string, strToInsert: string): string {
	const n = this.lastIndexOf(strToFind);

	if (n < 0) {
		return this.toString();
	}

	return this.substring(0, n) + strToInsert + this.substring(n);
};

const createNewMigrationByTemplate = (migrationFileName: string, migrationClassName: string): void => {
	const template = fs.readFileSync(path.join(__dirname, 'migrations/sample-migration.ts'))
		.toString()
		.replace('__migration_name_to_be_replaced__', migrationFileName)
		.replace('ClassNameToBeReplaced', migrationClassName);

	fs.writeFileSync(path.join(__dirname, `migrations/${migrationFileName}.ts`), template);
};

const addMigrationClassToIndex = (migrationFileName: string, migrationClassName: string): void => {
	const migrationsDirIndex = fs.readFileSync(path.join(__dirname, 'migrations/index.ts'))
		.toString()
		.insertBeforeLastOccurrence(
			'// --imports_section_end',
			`import { ${migrationClassName} } from './${migrationFileName}';\n`
		)
		.insertBeforeLastOccurrence(
			'// --migrations_list_end',
			`\tnew ${migrationClassName}(),\n`
		);

	fs.writeFileSync(path.join(__dirname, `migrations/index.ts`), migrationsDirIndex);
};

(() => {
	const migrationName = args.name;

	if (!migrationName) {
		throw new Error('"name" param is required');
	}

	const normalizedName = migrationName.replace(/\W/g, '');

	const currentTimestamp = formatDate(new Date(), 'YYYYMMDDHHmmss');

	const migrationClassName = `${normalizedName}${currentTimestamp}`;
	const migrationFileName = `${currentTimestamp}.${normalizedName}`;

	createNewMigrationByTemplate(migrationFileName, migrationClassName);

	addMigrationClassToIndex(migrationFileName, migrationClassName);
})();
