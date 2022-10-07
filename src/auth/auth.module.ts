import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from 'src/database/typeorm/typeorm.module';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashRepository } from './repositories/hash.repository';
import { RefreshRepository } from './repositories/refresh.repository';
import * as strategies from './strategies';

@Global()
@Module({
  imports: [
    TypeOrmModule.forCustomRepository([
      RefreshRepository,
      HashRepository,
      UserRepository
    ]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwtSecret'),
        signOptions: { expiresIn: '60h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ...Object.values(strategies),
  ],
  exports: [JwtModule, AuthService]
})
export class AuthModule { }
