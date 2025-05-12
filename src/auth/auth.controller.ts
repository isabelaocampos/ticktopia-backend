import { Controller, Get, Post, Body, Req, Headers, Param, UnauthorizedException, Delete, Put } from '@nestjs/common';
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
import { FindOneUserDto } from './dto/find-one-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UpdateRoleDto } from './dto/update-roles.dto';

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

  @Auth(ValidRoles.admin)
  @Get('users')
  findAllUsers() {
    return this.authService.findAll();
  }

  @Auth(ValidRoles.admin, ValidRoles.client, ValidRoles.eventManager)
  @Get('users/:id')
  findById(@Param() params: FindOneUserDto, @GetUser() user: User) {
    const isAdmin = user.roles.includes(ValidRoles.admin);
    const isSelf = params.id === user.id;

    if (!isAdmin && !isSelf) {
      throw new UnauthorizedException('You can only find yourself');
    }

    return this.authService.findById(params.id);
  }

  @Auth(ValidRoles.admin, ValidRoles.client, ValidRoles.eventManager)
  @Put('users/:id')
  updateUser(
    @Param() params: FindOneUserDto,
    @Body() updateAuthDto: UpdateAuthDto,
    @GetUser() user: User,
  ) {
    const isSelf = params.id === user.id;

    if (!isSelf) {
      throw new UnauthorizedException('You can only update your own profile');
    }

    return this.authService.updateUser(params.id, updateAuthDto);
  }

  @Auth(ValidRoles.admin, ValidRoles.client, ValidRoles.eventManager)
  @Delete('users/:id')
  deleteById(@Param() params: FindOneUserDto, @GetUser() user: User) {
    const isSelf = params.id === user.id;
    if (!isSelf) {
      throw new UnauthorizedException('You can only delete yourself');
    }

    return this.authService.deleteUserById(params.id);
  }

  @Auth(ValidRoles.admin)
  @Put('users/roles/:id')
  updateRolesToUser(@Param() params: FindOneUserDto, @Body() roles: UpdateRoleDto) {
    return this.authService.updateUserRoles(roles, params.id);
  }

}
