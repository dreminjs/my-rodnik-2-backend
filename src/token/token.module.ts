import { forwardRef, Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [JwtModule.register({}), PrismaModule, forwardRef(() => UserModule)],
  controllers: [TokenController],
  providers: [TokenService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [TokenService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class TokenModule {}
