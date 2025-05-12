import { Exclude } from 'class-transformer';

export class UserDto {

  @Exclude()
  password: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}