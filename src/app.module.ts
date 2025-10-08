import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InterviewModule } from './interview/interview.module';
import { QuestionModule } from './question/question.module';
import { ResponseModule } from './response/response.module';
import { ReportModule } from './report/report.module';
import { BlogModule } from './blog/blog.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    InterviewModule,
    QuestionModule,
    ResponseModule,
    ReportModule,
    BlogModule,
    AdminModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
