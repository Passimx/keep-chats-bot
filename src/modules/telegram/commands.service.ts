import { Injectable, OnModuleInit } from '@nestjs/common';
import { I18nService } from '../i18n/i18n.service';
import { Context, Markup } from 'telegraf';
import { BotActionsEnum } from './types/bot-actions.enum';
import { Envs } from '../../common/env/envs';
import { Archiver } from '@passimx/archiver';

@Injectable()
export class CommandsService implements OnModuleInit {
  private archiver: Archiver;

  constructor(private readonly i18nService: I18nService) {}

  onModuleInit() {
    this.archiver = new Archiver({
      apiKey: Envs.telegram.archiverApiKey,
      endpoint: Envs.telegram.archiverEndpoint,
    });
  }

  public backToMenu = async (ctx: Context) => {
    await ctx.editMessageText(`${this.t(ctx, 'select_action')}:`, {
      parse_mode: 'HTML',
      ...this.mainMenu(ctx),
    });
  };

  public onMenu = async (ctx: Context) => {
    await ctx.editMessageText(`${this.t(ctx, 'select_action')}:`, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            `📁 ${this.t(ctx, 'export_chat')}`,
            BotActionsEnum.EXPORT,
          ),
        ],
        [
          Markup.button.callback(
            `⬅️ ${this.t(ctx, 'back')}`,
            BotActionsEnum.BACK_TO_MENU,
          ),
        ],
      ]),
    });
  };

  public onExport = async (ctx: Context) => {
    const chat = await this.archiver.exportChat(ctx.chat!.id);
    if (!chat) {
      await ctx.reply('not found');
      return;
    }

    const json = JSON.stringify(chat, null, 2);
    const buffer = Buffer.from(json, 'utf-8');

    await ctx.replyWithDocument({
      source: buffer,
      filename: `chat.json`,
    });
  };

  public onStart = async (ctx: Context) => {
    await ctx.reply(this.t(ctx, 'start'), {
      parse_mode: 'HTML',
      disable_notification: true,
    });
    await ctx.reply(`${this.t(ctx, 'select_action')}:`, {
      parse_mode: 'HTML',
      ...this.mainMenu(ctx),
    });
  };

  private t(ctx: Context | string | undefined, key: string) {
    return this.i18nService.t(
      typeof ctx === 'string' ? ctx : ctx?.from?.language_code,
      key,
    );
  }

  private mainMenu = (ctx: Context | string | undefined) =>
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          `🌐️ ${this.t(ctx, 'menu')}`,
          BotActionsEnum.MENU,
        ),
      ],
    ]);
}
