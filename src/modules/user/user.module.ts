import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccessModule } from '../access/access.module';
import { DatabaseCollectionNames } from '../../shared/enums/db.enum';
import { UserController } from './user.controller';
import { UserQueryService } from './user.query.service';
import { UserRepository } from './user.repository';
import { UserSchema } from './user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DatabaseCollectionNames.USER, schema: UserSchema }]), AccessModule],
  controllers: [UserController],
  providers: [UserQueryService, UserRepository],
  exports: [UserQueryService, UserRepository],
})
export class UserModule {}
