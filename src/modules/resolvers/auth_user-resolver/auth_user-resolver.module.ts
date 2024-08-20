import { Module } from '@nestjs/common';

import { UserQueryService } from '../../user/user.query.service';

@Module({
  imports: [],
  providers: [UserQueryService],
  controllers: [],
  exports: [],
})
export class Auth_User_Resolver_Module {}
