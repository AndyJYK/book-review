import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from 'src/database/typeorm/typeorm.module';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AuthController } from './auth.controller';
import { HashRepository } from './repositories/hash.repository';
import { RefreshRepository } from './repositories/refresh.repository';
import * as strategies from './strategies';
import * as services from './services';

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
    ...Object.values(services),
    ...Object.values(strategies),
  ],
  exports: [
    JwtModule,
    ...Object.values(services)
  ]
})
export class AuthModule { }
