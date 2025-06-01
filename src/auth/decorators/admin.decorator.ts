import { SetMetadata } from '@nestjs/common';
import { ADMIN_KEY } from './../../common/constants/keys-roles.constants'; 
import { UserRole } from './../../common/enums/roles'; 

export const AdminAccess = () => SetMetadata(ADMIN_KEY, UserRole.ADMIN);