import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class FindOneUserDto {

    @ApiProperty({
        description: 'A valid uuid',
        nullable: false,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    id: string
}