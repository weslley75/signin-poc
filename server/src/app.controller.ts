import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/public.decorator';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
