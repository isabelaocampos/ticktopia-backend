import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/Login-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './dto/find-user.dto';

@Injectable()
export class AuthService {

  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  async create(createUserDto: CreateAuthDto & { roles?: string[] }) {
    const { password, ...userData } = createUserDto;
    try {
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password;

      return {
        user: user,
        token: this.getJwtToken({ id: user.id })
      };


    } catch (error) {
      console.log("error login", error);
      this.handleExceptions(error);
    }
  }

  async createEventManger(createAuthDto: CreateAuthDto) {
    const { password, ...userData } = createAuthDto;
    try {
      const user = this.userRepository.create({
        ...{ ...userData, roles: ["event-manaeger"] },
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password;

      return {
        user: user,
        token: this.getJwtToken({ id: user.id })
      };


    } catch (error) {
      console.log("error login", error);
      this.handleExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    });
    console.log(user)

    if (!user) throw new UnauthorizedException(`User with email ${email} not found`);

    if (!bcrypt.compareSync(password, user.password!))
      throw new UnauthorizedException(`Email or password incorrect`)

    delete user.password;

    return {
      user: user,
      token: this.getJwtToken({ id: user.id })
    }
  }
  async deleteAllUsers(): Promise<{ message: string }> {
    try {
      await this.userRepository.delete({});  // Ahora puedes eliminar los usuarios
      return { message: 'All users and their events have been deleted successfully' };
    } catch (error) {
      this.logger.error('Failed to delete all users', error.stack);
      throw new InternalServerErrorException('Could not delete users');
    }
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        roles: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findAll() {
    const users = await this.userRepository.find();
    return plainToInstance(UserDto, users);

  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleExceptions(error: any) {
    if (error.code === "23505")
      throw new BadRequestException(error.detail);

    this.logger.error(error.detail);
    throw new InternalServerErrorException('Unspected error, check your server logs');
  }

}
