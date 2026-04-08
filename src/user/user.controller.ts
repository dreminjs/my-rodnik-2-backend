import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from './user.decorator';
import { AccessTokenGuard } from '../token/guards/access-token.guard';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AccessTokenGuard)
  async findMe(@CurrentUser('id') id: string): Promise<User | null> {
    return await this.userService.findOne({
      where: {
        id,
      },
    });
  }
}
