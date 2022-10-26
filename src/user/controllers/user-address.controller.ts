import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ReviewService } from "src/review/review.service";


@ApiTags('User Address Api')
@Controller('@:user_address')
export class UserAddressController {
    constructor(
        private readonly reviewService: ReviewService,
    ) { }
}