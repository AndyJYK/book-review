import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { MyProfile } from 'src/auth/decorators/my-profile.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { CreateReviewDto } from './dtos/create-review.dto';
import { ReadReviewDto } from './dtos/read-review.dto';
import { ReviewService } from './review.service';

@ApiTags('Review Api')
@Controller('@:address')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService
    ) { }

    @ApiOperation({ summary: 'Create Book Review Api' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Create Book Review Success.' })
    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createBookreview(@Body() data: CreateReviewDto, @MyProfile() user: User, @Res() res: Response) {
        const review = await this.reviewService.createBookReview(data, user.id);
        if (!review) throw new HttpException({ message: '' }, HttpStatus.BAD_REQUEST);

        return res.status(HttpStatus.CREATED).json({
            message: 'Create Book Review Success.',
            review
        })
    }

    @ApiOperation({ summary: 'Read Book Review Api' })
    @ApiParam({ name: 'address', required: true, example: 'test' })
    @ApiParam({ name: 'review_id', required: true, example: '1' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Read Book Review Success.' })
    @Public()
    @Get(':review_id')
    async readBookReview(
        @Param('address') address: string,
        @Param('review_id') reviewId: number
    ) {
        const review = await this.reviewService.getBookReviewById(address, reviewId);
        return review;
    }
}
