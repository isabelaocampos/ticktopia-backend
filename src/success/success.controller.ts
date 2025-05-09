import { Controller, Get } from '@nestjs/common';

@Controller('success')
export class SuccessController {

    @Get()
    showSucces(){
        return "PAGO EXISTOSO"
    }
}
