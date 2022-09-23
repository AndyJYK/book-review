import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Swagger 세팅
 *
 * @param {INestApplication} app
 */
export function setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
        .setTitle('BookReview Web API')
        .setDescription('BookReview Web API description')
        .setVersion('0.0.1')
        .addCookieAuth('auth', {
            type: "http",
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
            'ath'
        )
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('bookreview', app, document);
}