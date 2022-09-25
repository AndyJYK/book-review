import { Module } from '@nestjs/common';
import { TypeOrmModule } from 'src/database/typeorm/typeorm.module';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashRepository } from './repositories/hash.repository';
import * as strategies from './strategies';

@Module({
  imports: [
    TypeOrmModule.forCustomRepository([
      UserRepository,
      HashRepository
    ])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ...Object.values(strategies),
  ],
})
export class AuthModule { }
