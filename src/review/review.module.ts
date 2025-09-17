import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [AuthModule],
})
export class ReviewModule {}
