import { Module } from '@nestjs/common';
import { SortService } from './sort.service';

@Module({
  providers: [SortService],
})
export class SortModule {}
