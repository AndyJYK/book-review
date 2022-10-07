import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";


@ApiTags('My Api')
@Controller('my')
export class MyController {
    constructor() { }

    @Get()
    async my() { }
}