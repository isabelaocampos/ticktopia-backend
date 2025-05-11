import { Controller, Get, Post, Body, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';
import { Auth } from './decorators/auth.decorator';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { IncomingHttpHeaders } from 'http';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/Login-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Auth(ValidRoles.admin)
  @Post('register/event-manager')
  createEventManager(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create({ ...createAuthDto, roles: ['event-manager'] });
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('users')
  findAllUsers() {
    return this.authService.findAll();
  }


}
