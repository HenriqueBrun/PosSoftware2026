import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(ClerkAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) return null;
    const { password: _password, ...result } = user;
    return result;
  }

  @UseGuards(ClerkAuthGuard)
  @Put('me')
  async updateProfile(
    @Request() req: any,
    @Body() body: { name?: string }
  ) {
    const data: any = {};
    if (body.name) data.name = body.name;

    const user = await this.usersService.update(req.user.userId, data);
    const { password: _password, ...result } = user;
    return result;
  }
}
