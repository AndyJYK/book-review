import { Module } from '@nestjs/common';
import { TypeOrmModule } from 'src/database/typeorm/typeorm.module';
import { MyController } from './controllers/my.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forCustomRepository([
      UserRepository,
    ]),
  ],
  controllers: [MyController],
  providers: [UserService]
})
export class UserModule { }
