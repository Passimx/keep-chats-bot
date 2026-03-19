import { Module } from '@nestjs/common';
import { TelegramService } from './telegram-service';
import { I18nModule } from '../i18n/i18n.module';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';
import { APP_GUARD } from '@nestjs/core';
import { ActionsGuard } from '../../common/guards/actions/actions.guard';
import { CommandsService } from './commands.service';

@Module({
  imports: [I18nModule],
  controllers: [ActionsController],
  providers: [
    TelegramService,
    ActionsService,
    CommandsService,
    { provide: APP_GUARD, useClass: ActionsGuard },
  ],
  exports: [TelegramService],
})
export class TelegramModule {}
