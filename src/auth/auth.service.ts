import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { TokenService } from '../token/token.service';
import { hash, compare } from 'bcrypt';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: AuthDto, res: FastifyReply) {
    const hashedPassword = await hash(dto.password, 10);

    const user = await this.userService.createOne({
      name: dto.fullName,
      email: dto.email,
      hashedPassword: hashedPassword,
    });

    return this.tokenService.generateTokens(
      {
        userId: user.id,
      },
      res,
    );
  }

  async login(dto: AuthDto, res: FastifyReply) {
    const user = await this.userService.findOne({
      where: {
        name: dto.fullName,
      },
    });

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await compare(dto.password, user?.hashedPassword);

    if (!isPasswordValid) {
      throw new BadRequestException('Неверный пароль');
    }

    return this.tokenService.generateTokens(
      {
        userId: user?.id,
      },
      res,
    );
  }

  async logout(userId: string): Promise<void> {
    await this.tokenService.deleteRefreshToken({ userId });
  }
}
