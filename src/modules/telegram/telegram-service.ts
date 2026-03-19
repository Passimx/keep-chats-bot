import { Injectable } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';

import { EntityManager } from 'typeorm';
import { Envs } from '../../common/env/envs';
import { UserEntity } from '../database/entities/user.entity';
import { I18nService } from '../i18n/i18n.service';
import { Archiver } from '../sdk';
import { ActionsArrayType } from './types/actions-array.type';
import { BotActionsEnum } from './types/bot-actions.enum';
import { CommandsService } from './commands.service';

@Injectable()
export class TelegramService {
  private bot: Telegraf;
  private botInfo: UserEntity;

  constructor(
    private readonly em: EntityManager,
    private readonly i18nService: I18nService,
    private readonly commandsService: CommandsService,
  ) {}

  async onModuleInit() {
    this.bot = new Telegraf(Envs.telegram.botToken);
    this.bot.catch((err) => {
      console.error('Telegraf error:', err);
    });

    const archiver = new Archiver({
      apiKey: 'bot_live_23942394',
      endpoint: 'http://localhost:2000/telegram/events',
    });
    archiver.listen(this.bot);

    await this.getMe();

    const commandArray: ActionsArrayType = [
      [BotActionsEnum.START, this.commandsService.onStart],
      // [BotActionsEnum.EXPORT, this.commandsService.onExport],
    ];

    const actionArray: ActionsArrayType = [
      [BotActionsEnum.MENU, this.commandsService.onMenu],
      [BotActionsEnum.BACK_TO_MENU, this.commandsService.backToMenu],
    ];

    actionArray.forEach(([filters, action]) =>
      this.bot.action(filters, action),
    );

    commandArray.forEach(([filters, action]) =>
      this.bot.command(filters, action),
    );

    if (!this.botInfo.userName?.includes('test'))
      for (const lang of Object.keys(this.i18nService.langs)) {
        await this.bot.telegram.setMyDescription(
          this.t(lang, 'description'),
          lang,
        );

        await this.bot.telegram.setMyShortDescription(
          this.t(lang, 'short_description'),
          lang,
        );
      }

    void this.bot.launch();
  }

  onModuleDestroy() {
    this.bot.stop();
  }

  private t(ctx: Context | string | undefined, key: string) {
    return this.i18nService.t(
      typeof ctx === 'string' ? ctx : ctx?.from?.language_code,
      key,
    );
  }

  private async getMe() {
    const userInfo = await this.bot.telegram.getMe();

    await this.em.upsert(
      UserEntity,
      {
        id: userInfo.id,
        isBot: userInfo.is_bot,
        firstName: userInfo.first_name,
        userName: userInfo.username,
        languageCode: userInfo.language_code,
      },
      { conflictPaths: ['id'] },
    );

    this.botInfo = (await this.em.findOne(UserEntity, {
      where: { id: userInfo.id },
    }))!;
  }
}
