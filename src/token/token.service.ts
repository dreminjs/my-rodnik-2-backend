import { Injectable } from '@nestjs/common';
import { ITokenPayload, ITokens } from './token.interface';
import { FastifyReply } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { IStandartResponse } from 'src/interfaces/common.interface';
import { Prisma, RefreshToken } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  public async deleteOne(
    args: Prisma.RefreshTokenDeleteArgs,
  ): Promise<RefreshToken> {
    return await this.prisma.refreshToken.delete(args);
  }

  public async generateTokens(
    payload: ITokenPayload,
    res: FastifyReply,
  ): Promise<IStandartResponse> {
    const oldToken = await this.findOne({ userId: payload.userId });

    if (oldToken) {
      await this.deleteOne({
        where: {
          userId: payload.userId,
          token: oldToken.token,
        },
      });
    }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '1w',
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });

    await this.saveRefreshToken({
      user: {
        connect: {
          id: payload.userId,
        },
      },
      token: refreshToken,
    });

    return this.buildTokensResponse({ accessToken, refreshToken }, res);
  }

  public async validateToken(token: string): Promise<ITokenPayload> {
    return this.jwtService.verify(token);
  }

  private async saveRefreshToken(
    payload: Prisma.RefreshTokenCreateInput,
  ): Promise<RefreshToken> {
    return await this.prisma.refreshToken.create({ data: payload });
  }

  public async findOne(
    where: Prisma.RefreshTokenWhereInput,
  ): Promise<RefreshToken | null> {
    return await this.prisma.refreshToken.findFirst({
      where,
    });
  }

  public async deleteRefreshToken(where: Prisma.RefreshTokenWhereUniqueInput) {
    return await this.prisma.refreshToken.delete({ where });
  }

  private buildTokensResponse(
    dto: ITokens,
    res: FastifyReply,
  ): IStandartResponse {
    res.setCookie('accessToken', dto.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.setCookie('refreshToken', dto.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      message: 'успешно!',
    };
  }
}
