import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class CreateReviewDto {
    @ApiProperty({
        example: 'When something is important enough, you do it, even if the odds are not in your favor.',
        description: 'Book Review Title',
        required: true
    })
    @IsString()
    readonly title: string;

    @ApiProperty({
        example: 'Quote',
        description: 'Book Review Subtitle'
    })
    @IsOptional()
    @IsString()
    readonly sub_title?: string;

    @ApiProperty({
        example: '<h2>Example....</h2>',
        description: 'Book Review Content',
        required: true
    })
    @IsString()
    readonly content: string;
}