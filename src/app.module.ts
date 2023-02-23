import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SortModule } from './sort/sort.module';

@Module({
  imports: [SortModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
