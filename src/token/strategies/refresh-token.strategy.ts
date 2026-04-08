import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { ITokenPayload } from '../token.interface';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'RefreshTokenStrategy',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['refreshToken'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET')!,
    });
  }

  async validate({ userId }: ITokenPayload): Promise<User | null> {
    return await this.userService.findOne({ where: { id: userId } });
  }
}
