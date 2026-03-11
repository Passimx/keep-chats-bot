import { Injectable } from '@nestjs/common';
import ru from './languages/ru';
import en from './languages/en';

export type Dictionary = Record<string, string>;

@Injectable()
export class I18nService {
  public readonly langs: Record<string, Dictionary> = {
    ru,
    en,
  };

  t(lang: string = 'en', key: string): string {
    const locale = this.langs[lang] ?? this.langs.en;
    return locale[key] ?? key;
  }
}
