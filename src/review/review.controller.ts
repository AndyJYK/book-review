import { Body, Controller, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { MyProfile } from "src/auth/decorators/my-profile.decorator";
import { Public } from "src/auth/decorators/public.decorator";
import { JwtValidateGuard } from "src/auth/guards/jwt-validate.guard";
import { User } from "src/user/entities/user.entity";
import { GetReviewListDto } from "./dtos/get-review-list.dto";
import { WriteReviewDto } from "./dtos/write-review.dto";
import { ReviewService } from "./review.service";

@ApiTags('Review Api')
@Controller('reviews')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
    ) { }

    @ApiOperation({ summary: 'Write BookReview Api' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Write BookReview Success.' })
    @UseGuards(JwtValidateGuard)
    @Post('/write')
    async writeBookReview(@MyProfile() user: User, @Body() data: WriteReviewDto, @Res() res: Response) {
        const review = await this.reviewService.writeBookReview(data, user.id, user.user_address);

        return res.status(HttpStatus.CREATED).json({
            message: 'Write Book Review Success.',
            review
        })
    }

    @ApiOperation({ summary: 'Read BookReview List Api' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Read BookReview List Success.' })
    @Public()
    @Post('/read')
    async getReviewList(@Body() { limit, offset }: GetReviewListDto) {
        return await this.reviewService.getBookReviewListInPopularity({ limit, offset });
    }
}