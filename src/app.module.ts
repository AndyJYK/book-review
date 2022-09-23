import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { configuration } from './config';
import { TypeOrmModule } from './database/typeorm/typeorm.module';
import { BookModule } from './book/book.module';
import { ReviewModule } from './review/review.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        ...await config.get('db')
      })
    }),
    BookModule,
    ReviewModule,
    CommonModule,
    UserModule,
  ],
  providers: [AppService],
})
export class AppModule { }
