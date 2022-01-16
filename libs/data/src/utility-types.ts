import { Logger } from '@nestjs/common';
import { QueryRunner } from 'typeorm';


export interface MigrationContext {
		queryRunner: QueryRunner;
    logger: Logger;
}
