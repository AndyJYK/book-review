import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getMaxFromQueryResult } from 'src/utils/query.util';
import { CreateReviewDto } from './dtos/create-review.dto';
import { EditReviewDto } from './dtos/edit-review.dto';
import { Review } from './entities/review.entity';
import { ReviewRepository } from './repositories/review.repository';

@Injectable()
export class ReviewService {
    constructor(
        private readonly reviewRepository: ReviewRepository
    ) { }

    async createBookReview(data: CreateReviewDto, authorId: string): Promise<Review> {
        if (!data || !data.title || !data.content) throw new HttpException({ message: 'Data not found' }, HttpStatus.BAD_REQUEST);

        const result = await this.reviewRepository.query(
            `select
                COALESCE(max(r.review_id), 0)
            from
                review r
            where
                r.review_author_id = $1
            `,
            [authorId]
        );
        const maxReviewId = result[0].coalesce;
        if (maxReviewId === null) throw new HttpException({ message: "Can't get max count" }, HttpStatus.NOT_FOUND);

        const newReview = await this.reviewRepository.save(
            this.reviewRepository.create({
                review_id: maxReviewId + 1,
                review_title: data.title,
                review_sub_title: data.sub_title,
                content: data.content,
                review_author_id: authorId
            }));
        return newReview;
    }

    async getBookReviewById(address: string, reviewId: number): Promise<Review> {
        const review = await this.reviewRepository.getReviewById(address, reviewId);
        if (!review) throw new HttpException({ message: 'Cannot find the Review' }, HttpStatus.NOT_FOUND);

        return review;
    }

    async editBookReview(data: EditReviewDto, authorId: string) {

    }
}
