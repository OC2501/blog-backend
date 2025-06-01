import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { UserRole } from "../enums/roles";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AuthGuard } from "./../../auth/guards/auth.guard";
import { RoleGuard } from "./../../auth/guards/role.guard";
import { ROLES_KEY } from "../constants/keys-roles.constants";

export function Auth(...roles: Array<keyof typeof UserRole>) {
    return applyDecorators(
        SetMetadata(ROLES_KEY, roles),
        UseGuards(AuthGuard, RoleGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: "Unauthorized!" }),
    );
}