import { Injectable } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';

import { EntityManager } from 'typeorm';
import { Envs } from '../../common/env/envs';
import { UserEntity } from '../database/entities/user.entity';
import { I18nService } from '../i18n/i18n.service';
import { ActionsService } from './actions.service';
import { BotActionsEnum } from './types/bot-actions.enum';
import { ActionsArrayType } from './types/actions-array.type';

@Injectable()
export class TelegramService {
  private bot: Telegraf;
  private botInfo: UserEntity;

  constructor(
    private readonly em: EntityManager,
    private readonly i18nService: I18nService,
    private readonly actionsService: ActionsService,
  ) {}

  async onModuleInit() {
    this.bot = new Telegraf(Envs.telegram.botToken);
    this.bot.catch((err) => {
      console.error('Telegraf error:', err);
    });
    await this.getMe();

    const commandArray: ActionsArrayType = [
      [BotActionsEnum.START, this.actionsService.onStart],
      [BotActionsEnum.EXPORT, this.actionsService.onExport],
    ];

    const actionArray: ActionsArrayType = [
      [BotActionsEnum.MENU, this.actionsService.onMenu],
      [BotActionsEnum.BACK_TO_MENU, this.actionsService.backToMenu],
    ];

    actionArray.forEach(([filters, action]) =>
      this.bot.action(filters, action),
    );

    commandArray.forEach(([filters, action]) =>
      this.bot.command(filters, action),
    );

    this.bot.on('message', this.actionsService.onMessage);
    this.bot.on('my_chat_member', this.actionsService.onJoinChat);
    this.bot.on('edited_message', this.actionsService.onEditMessage);
    this.bot.on('callback_query', this.actionsService.onCallbackQuery);

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

    await this.bot.launch();
  }

  private t(ctx: Context | string | undefined, key: string) {
    return this.i18nService.t(
      typeof ctx === 'string' ? ctx : ctx?.from?.language_code,
      key,
    );
  }

  onModuleDestroy() {
    this.bot.stop();
  }

  private async getMe() {
    const userInfo = await this.bot.telegram.getMe();

    await this.em.upsert(
      UserEntity,
      {
        id: userInfo.id,
        userName: userInfo.username,
        languageCode: userInfo.language_code,
      },
      { conflictPaths: ['id'] },
    );

    this.botInfo = (await this.em.findOne(UserEntity, {
      where: { id: userInfo.id },
    }))!;

    this.actionsService.setBotInfo(this.botInfo);
  }
}
