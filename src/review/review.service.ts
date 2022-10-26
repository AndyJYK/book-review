import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserAvatar } from 'src/user/entities/user-avatar.entity';
import { User } from 'src/user/entities/user.entity';
import { GetReviewListDto } from './dtos/get-review-list.dto';
import { WriteReviewDto } from './dtos/write-review.dto';
import { Review } from './entities/review.entity';
import { ReviewRepository } from './repositories/review.repository';

@Injectable()
export class ReviewService {
    constructor(
        private readonly reviewRepository: ReviewRepository
    ) { }

    async writeBookReview(data: WriteReviewDto, authorId: string, authorAddress: string): Promise<Review> {
        if (!data) {
            throw new HttpException({ message: 'Data is not found' },
                HttpStatus.BAD_REQUEST
            );
        }

        const getMaxReviewId: [{ coalesce: number }] = await this.reviewRepository.query(
            `select
                COALESCE(max(r.review_id), 0)
            from
                review r
            where
                r.review_author_id = $1
            `,
            [authorId]
        );

        const maxReviewId = getMaxReviewId[0].coalesce;
        if (maxReviewId === null) {
            throw new HttpException({ message: "Can't get max count" },
                HttpStatus.NOT_FOUND
            )
        }

        const newReview = await this.reviewRepository.save(
            this.reviewRepository.create({
                review_id: maxReviewId + 1,
                review_title: data.title,
                review_sub_title: data.sub_title,
                content: data.content,
                review_author_id: authorId,
                review_author_address: authorAddress
            }));
        return newReview;
    }

    async getBookReviewListByUserAddress({ limit = 15, offset = 0 }: GetReviewListDto, id: string): Promise<Review[]> {
        return await this.reviewRepository
            .createQueryBuilder('r')
            .select([
                'r.id',
                'r.create_date',
                'r.update_date',
                'r.review_title',
                'r.thumbnail',
                'r.views'
            ])
            .leftJoinAndSelect('r.review_author', 'u')
            .leftJoin('u.user_avatar', 'av')
            .addSelect([
                'av.id',
                'av.create_date',
                'av.update_date',
                'av.avatar'
            ])
            .orderBy('r.views', 'DESC')
            .limit(limit)
            .offset(offset)
            .getMany();
    }

    async getBookReviewListInPopularity({ limit = 15, offset = 0 }: GetReviewListDto): Promise<Review[]> {
        return await this.reviewRepository
            .createQueryBuilder('r')
            .select([
                'r.id',
                'r.create_date',
                'r.update_date',
                'r.review_id',
                'r.review_title',
                'r.thumbnail',
                'r.views'
            ])
            .leftJoin('r.review_author', 'u')
            .addSelect([
                'u.id',
                'u.email',
                'u.name',
                'u.user_address'
            ])
            .leftJoin('u.user_avatar', 'av')
            .addSelect(['av.avatar'])
            .orderBy('r.views', 'DESC')
            .limit(limit)
            .offset(offset)
            .getMany();
    }
}
