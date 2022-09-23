import { Module } from '@nestjs/common';
import { TypeOrmModule } from 'src/database/typeorm/typeorm.module';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forCustomRepository([
      UserRepository,
    ]),
  ],
  providers: [UserService]
})
export class UserModule { }
