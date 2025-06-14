import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from 'src/common/constants/keys-roles.constants';

export const PublicAccess = () => SetMetadata(PUBLIC_KEY, true);