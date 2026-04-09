import { Body, Controller, Delete, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FastifyReply } from 'fastify';
import { CurrentUser } from '../user/decorators/user.decorator';
import { IStandartResponse } from 'src/interfaces/common.interface';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<IStandartResponse> {
    return this.authService.register(dto, response);
  }

  @Post('login')
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<IStandartResponse> {
    return this.authService.login(dto, response);
  }

  @Delete('logout')
  async logout(@CurrentUser('id') userId: string): Promise<void> {
    await this.authService.logout(userId);
  }
}
