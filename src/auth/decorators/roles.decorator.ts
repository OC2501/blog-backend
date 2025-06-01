import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from './../../common/constants/keys-roles.constants';
import { UserRole } from './../../common/enums/roles';

export const RolesAccess = (...roles: Array<keyof typeof UserRole>) =>
  SetMetadata(ROLES_KEY, roles);