import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { AuthModule } from 'src/auth/auth.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [AuthModule, ImagesModule],
})
export class CategoryModule {}
