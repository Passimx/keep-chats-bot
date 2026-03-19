// sdk/patch.ts
import { Telegram } from 'telegraf';

let patched = false;

export function patchTelegram(send: (data: any) => void) {
  if (patched) return;
  patched = true;

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalCall = Telegram.prototype.callApi;

  Telegram.prototype.callApi = async function (method, payload, ...rest) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await originalCall.call(this, method, payload, ...rest);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (method === 'sendMessage') send({ message: result });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    else if (method === 'editMessageText') send({ edited_message: result });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  };
}
