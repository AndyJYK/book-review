import { Module } from '@nestjs/common';
import { TypeOrmModule } from 'src/database/typeorm/typeorm.module';
import { ReviewRepository } from './repositories/review.repository';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';

@Module({
  imports: [
    TypeOrmModule.forCustomRepository([
      ReviewRepository
    ])
  ],
  providers: [ReviewService],
  controllers: [ReviewController]
})
export class ReviewModule { }
