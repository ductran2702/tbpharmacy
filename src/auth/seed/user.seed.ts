import { Command, Positional } from 'nestjs-command';
import { Injectable, Logger } from '@nestjs/common';
import { UserRole } from 'src/common/constants';
import { Connection } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class UserSeed {
    constructor(
        private readonly connection: Connection
    ) { }
    
    private readonly logger = new Logger(UserSeed.name);

    @Command({ command: 'seed:admin <username>', describe: 'Seed a admin', autoExit: true })
    async createAdmin(
        @Positional({
            name: 'username',
            describe: 'The admin username string',
            type: 'string',
            default: 'admin'
          }) username: string,
    ) {
        const user = new User();
        user.username = username;
        user.password = '123!@#Aa';
        user.role = UserRole.ADMIN;

        const repository = this.connection.getRepository(User);
        const adminExists = await repository.findOne({ where: { username }});
        if (adminExists) {
            return this.logger.warn(`Username ${username} existed !!!`)
        }
        const result = await this.connection.getRepository(User).save(user);
        this.logger.log(`[Seed][Admin] Create new admin successful | ID = ${result.id}`);
    }
}