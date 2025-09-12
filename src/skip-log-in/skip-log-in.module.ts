import { Module } from '@nestjs/common';
import { SkipLogInController } from './skip-log-in.controller';
import { SkipLogInService } from './skip-log-in.service';

@Module({
  controllers: [SkipLogInController],
  providers: [SkipLogInService],
})
export class SkipLogInModule {}
