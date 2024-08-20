// Importing the required libraries
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

// Importing the required internal files
// import { JwtUserStrategy } from './strategies/jwt-user.strategy';

// Importing the required external modules and files
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
    WorkspaceModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
