import { Context } from 'telegraf';

export type ActionsArrayType = [
  string,
  (ctx?: Context, next?: () => Promise<void>) => Promise<void>,
][];
