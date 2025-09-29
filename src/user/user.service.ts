import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(email: string, password: string, role = 'User') {
    const hashed = await bcrypt.hash(password, 10);
    return this.prisma.user.create({ data: { email, password: hashed, role } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByid(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async findAll() {
    return this.prisma.user.findMany();
  }
  async updateUser(
    id: string,
    data: { email?: string; password?: string; role?: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.delete({ where: { id } });
  }
  async getUserId(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
  async updateProfile(userId: string, name: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (profile) {
      return this.prisma.profile.update({
        where: { userId },
        data: { name },
      });
    } else {
      return this.prisma.profile.create({
        data: { userId, name },
      });
    }
  }
}
