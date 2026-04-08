import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { TokenModule } from 'src/token/token.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [UserModule, AuthModule, TokenModule, PrismaModule],
  controllers: [AppController],
})
export class AppModule {}
