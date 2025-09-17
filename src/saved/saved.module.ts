import { Module } from '@nestjs/common';
import { SavedController } from './saved.controller';
import { SavedService } from './saved.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SavedController],
  providers: [SavedService],
  imports: [AuthModule],
})
export class SavedModule {}
