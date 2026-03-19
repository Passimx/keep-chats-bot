import { Telegraf } from 'telegraf';
import { patchTelegram } from './patch';

export class Archiver {
  private apiKey: string;
  private endpoint: string;

  constructor(options: { apiKey: string; endpoint: string }) {
    this.apiKey = options.apiKey;
    this.endpoint = options.endpoint;
  }

  public listen(bot: Telegraf) {
    patchTelegram((data) => this.send(data));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const originalHandleUpdate = bot.handleUpdate.bind(bot);

    bot.handleUpdate = (update, webhookResponse) => {
      void this.send(update);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call
      return originalHandleUpdate(update, webhookResponse);
    };
  }

  private send(data: any) {
    fetch(this.endpoint, {
      method: 'POST',
      headers: {
        Authorization: this.apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) =>
        res.text().then((text) => text.length && console.log(text)),
      )
      .catch(console.error);
  }
}
