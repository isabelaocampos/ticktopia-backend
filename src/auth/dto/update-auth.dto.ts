import { PartialType } from '@nestjs/swagger';
import { CreateAuthDto } from './create-auth.dto';
import { Exclude } from 'class-transformer';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
    @Exclude()
    password: string;
}
