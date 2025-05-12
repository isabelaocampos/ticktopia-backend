import { Controller, Get } from '@nestjs/common';

@Controller('failed')
export class FailedController {

    @Get()
    showFailure(){
        return "PAGO FALLIDO"
    }
}
