import { applyDecorators, UseGuards } from "@nestjs/common";
import { ValidRoles } from "../enums/valid-roles.enum";
import { RoleProtected } from "./role-protected/role-protected.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UserRoleGuard } from "../guards/user-role/user-role.guard";

export function Auth(...roles: ValidRoles[]){
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard('jwt'), UserRoleGuard)
    )
}