import { Module } from '@nestjs/common';
import { PlaceItemController } from './place-item.controller';
import { PlaceItemService } from './place-item.service';

@Module({
  controllers: [PlaceItemController],
  providers: [PlaceItemService],
})
export class PlaceItemModule {}
