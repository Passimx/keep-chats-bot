import { Module } from '@nestjs/common';
import { TelegramService } from './telegram-service';
import { I18nModule } from '../i18n/i18n.module';
import { ActionsService } from './actions.service';

@Module({
  imports: [I18nModule],
  providers: [TelegramService, ActionsService],
  exports: [TelegramService],
})
export class TelegramModule {}
