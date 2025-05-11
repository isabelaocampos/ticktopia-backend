import { Controller, Post, Body, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ValidRoles } from './enums/valid-roles.enum';
import { Auth } from './decorators/auth.decorator';

import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/Login-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Auth(ValidRoles.admin)
  @Post('register/event-manager')
  createEventManager(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create({...createAuthDto, roles: ['event-manager']});
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }


  // @Get('private2')
  // @Auth(ValidRoles.teacher)
  // privateRoute2(
  //   @GetUser() user: User,
   
  // ){
  //   console.log("🚀 ~ :34 ~ AuthController ~ headers:", user)
  //   return{
  //     ok: true,
  //     message: 'Success!'
  //   }
  // }


}
