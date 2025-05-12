import { ApiProperty } from "@nestjs/swagger";
import { ValidRoles } from "../enums/valid-roles.enum";
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty } from "class-validator";


export class UpdateRoleDto {
    @ApiProperty({
        description: 'List of roles that we want to set to a user',
        nullable: false,
        required: true,
        isArray: true,
        enum: ValidRoles, 
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(ValidRoles, { each: true })
    roles: ValidRoles[];
}
