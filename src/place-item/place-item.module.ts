import { Module } from '@nestjs/common';
import { PlaceItemController } from './place-item.controller';
import { PlaceItemService } from './place-item.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PlaceItemController],
  providers: [PlaceItemService],
  imports: [AuthModule],
})
export class PlaceItemModule {}
