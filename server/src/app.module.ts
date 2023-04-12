import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PassportModule} from "@nestjs/passport";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "./auth/jwt-auth.guard";
import { PrismaService } from './prisma/prisma.service';
import { CryptPasswordModule } from './crypt-password/crypt-password.module';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'oauth2'}),
    AuthModule,
    UsersModule,
    CryptPasswordModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }, PrismaService,],
})
export class AppModule {
}
