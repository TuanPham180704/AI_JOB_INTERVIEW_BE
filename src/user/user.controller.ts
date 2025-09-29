import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('users')
export class UserController {
  constructor(private usersService: UserService) {}

  @Post()
  createUser(@Body() body: { email: string; password: string; role?: string }) {
    return this.usersService.createUser(body.email, body.password, body.role);
  }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.usersService.getUserId(req.user.userId);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.findByid(id);
  }

  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() body: { email?: string; password?: string; role?: string },
  ) {
    return this.usersService.updateUser(id, body);
  }

  @Put('profile/:userId')
  updateProfile(
    @Param('userId') userId: string,
    @Body() body: { name: string },
  ) {
    return this.usersService.updateProfile(userId, body.name);
  }


  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
