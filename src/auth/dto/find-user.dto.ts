import { Exclude } from 'class-transformer';

export class UserDto {
  id: string;
  email: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}