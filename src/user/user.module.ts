import { Module } from '@nestjs/common';
import { TypeOrmModule } from 'src/database/typeorm/typeorm.module';
import { ReviewRepository } from 'src/review/repositories/review.repository';
import { ReviewModule } from 'src/review/review.module';
import { MyController } from './controllers/my.controller';
import { UserAddressController } from './controllers/user-address.controller';
import { UserAvatarRepository } from './repositories/user-avatar.repository';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forCustomRepository([
      UserRepository,
      UserAvatarRepository,
      ReviewRepository
    ]),
    ReviewModule,
  ],
  controllers: [MyController, UserAddressController],
  providers: [UserService]
})
export class UserModule { }
