import { CustomRepository } from "src/database/typeorm/typeorm.decorator";
import { Repository } from "typeorm";
import { Review } from "../entities/review.entity";


@CustomRepository(Review)
export class ReviewRepository extends Repository<Review> {
    async getReviewById(address: string, reviewId: number) {
        return await this.createQueryBuilder('r')
            .select([
                'r',
                'u.id',
                'u.email',
                'u.name'
            ])
            .leftJoin('r.review_author', 'u')
            .where("r.review_id = :reviewId", { reviewId })
            .andWhere('u.app_address = :address', { address })
            .getOne()
    }
};