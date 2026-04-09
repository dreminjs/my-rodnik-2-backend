import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { CurrentUser } from '../user/decorators/user.decorator';
import { FastifyReply } from 'fastify';
import { TokenService } from './token.service';
import { IStandartResponse } from 'src/interfaces/common.interface';

@UseGuards(RefreshTokenGuard)
@Controller('tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  public async index(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<IStandartResponse> {
    return await this.tokenService.generateTokens({ userId }, res);
  }
}
