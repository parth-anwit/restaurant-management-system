import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { Access, accessSchema } from './access.schema';
import { AccessRepository } from './access.repository';
import { AccessService } from './access.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Access.name, schema: accessSchema }])],
  controllers: [],
  providers: [AccessService, AccessRepository],
  exports: [AccessService, AccessRepository],
})
export class AccessModule {}
