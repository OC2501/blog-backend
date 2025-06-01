import { SetMetadata } from '@nestjs/common';
import { USER_KEY } from './../../common/constants/keys-roles.constants';
import { UserRole } from './../../common/enums/roles';

export const UserAccess = () => SetMetadata(USER_KEY, UserRole.USER);