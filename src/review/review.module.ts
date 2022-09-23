import { Module } from '@nestjs/common';
import { TypeOrmModule } from 'src/database/typeorm/typeorm.module';
import { ReviewRepository } from './repositories/review.repository';
import { ReviewService } from './review.service';

@Module({
  imports: [
    TypeOrmModule.forCustomRepository([
      ReviewRepository
    ])
  ],
  providers: [ReviewService]
})
export class ReviewModule { }
