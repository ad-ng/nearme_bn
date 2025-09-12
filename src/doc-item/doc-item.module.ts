import { Module } from '@nestjs/common';
import { DocItemController } from './doc-item.controller';
import { DocItemService } from './doc-item.service';

@Module({
  controllers: [DocItemController],
  providers: [DocItemService],
})
export class DocItemModule {}
