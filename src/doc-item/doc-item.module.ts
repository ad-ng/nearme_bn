import { Module } from '@nestjs/common';
import { DocItemController } from './doc-item.controller';
import { DocItemService } from './doc-item.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [DocItemController],
  providers: [DocItemService],
  imports: [AuthModule],
})
export class DocItemModule {}
