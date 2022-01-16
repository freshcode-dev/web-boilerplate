import { InputMigrations } from 'umzug';
import { MigrationContext } from '../utility-types';
import { CreateUsersTable20220114133300 } from './20220114133300.CreateUsersTable';
// --imports_section_end

const migrationsList: InputMigrations<MigrationContext> = [
	new CreateUsersTable20220114133300(),
// --migrations_list_end
];

export default migrationsList;
