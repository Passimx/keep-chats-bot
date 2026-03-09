import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [DatabaseModule, TelegramModule],
})
export class AppModule {}
