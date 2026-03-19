import { Injectable } from '@nestjs/common';
import { I18nService } from '../i18n/i18n.service';
import { Context, Markup } from 'telegraf';
import { BotActionsEnum } from './types/bot-actions.enum';

@Injectable()
export class CommandsService {
  constructor(private readonly i18nService: I18nService) {}

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
            `⬅️ ${this.t(ctx, 'back')}`,
            BotActionsEnum.BACK_TO_MENU,
          ),
        ],
      ]),
    });
  };

  // public onExport = async (ctx: Context, next: () => Promise<void>) => {
  // const chat = ctx.chat as ChatType;
  //
  // const chatDb = await this.em.findOneOrFail(ChatEntity, {
  //   where: { id: chat.id },
  //   relations: ['messages'],
  //   order: { messages: { messageId: 'ASC' } },
  // });
  //
  // const json = JSON.stringify(chatDb, null, 2);
  // const buffer = Buffer.from(json, 'utf-8');
  //
  // const message = (await ctx.replyWithDocument({
  //   source: buffer,
  //   filename: `chat.json`,
  // })) as MessageType;
  //
  // await next();
  //
  // await this.onMessage(message);
  // };

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
