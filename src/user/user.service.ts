import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        role: 'User',
        profile: { create: { name: dto.name } },
      },
      include: { profile: true },
    });
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({ include: { profile: true } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const data: any = { ...dto };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.name) {
      await this.prisma.profile.upsert({
        where: { userId: id },
        update: { name: dto.name },
        create: { userId: id, name: dto.name },
      });
    }

    return this.prisma.user.update({
      where: { id },
      data,
      include: { profile: true },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.profile.deleteMany({ where: { userId: id } });
    return this.prisma.user.delete({ where: { id } });
  }
}
