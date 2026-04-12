import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByClerkId(clerkId: string) {
    return this.prisma.user.findUnique({
      where: { clerkId },
    });
  }

  async findOrCreateByClerkId(clerkId: string, email: string, name?: string) {
    let user = await this.findByClerkId(clerkId);
    if (user) return user;

    // Try to find by email (legacy user) and link them
    user = await this.findByEmail(email);
    if (user) {
      return this.prisma.user.update({
        where: { id: user.id },
        data: { clerkId },
      });
    }

    // Create new user
    return this.prisma.user.create({
      data: {
        clerkId,
        email,
        name: name || email.split('@')[0],
      },
    });
  }

  async create(data: { email: string; name: string; password?: string; clerkId?: string }) {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: string, data: { name?: string; phone?: string; password?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
