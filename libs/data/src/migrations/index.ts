import { InputMigrations } from 'umzug';
import { MigrationContext } from '../utility-types';
import { CreateUsersTable20220114133300 } from './20220114133300.CreateUsersTable';
import { Session20230226154759 } from './20230226154759.Session';
// --imports_section_end

const migrationsList: InputMigrations<MigrationContext> = [
	new CreateUsersTable20220114133300(),
	new Session20230226154759(),
// --migrations_list_end
];

export default migrationsList;
