import { CustomRepository } from "src/database/typeorm/typeorm.decorator";
import { Repository } from "typeorm";
import { Review } from "../entities/review.entity";


@CustomRepository(Review)
export class ReviewRepository extends Repository<Review> { };