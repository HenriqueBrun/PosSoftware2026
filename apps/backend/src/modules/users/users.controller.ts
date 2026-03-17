import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as bcrypt from 'bcryptjs';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(
    @Request() req: any,
    @Body() body: { name?: string; password?: string }
  ) {
    const data: any = {};
    if (body.name) data.name = body.name;
    if (body.password) data.password = await bcrypt.hash(body.password, 10);

    const user = await this.usersService.update(req.user.userId, data);
    const { password, ...result } = user;
    return result;
  }
}
