import { Locale, LocaleTranslations } from 'adminjs';

const translations: Record<string, LocaleTranslations> = {
  en: {
    actions: {},
    buttons: {},
    labels: {
      loginWelcome: 'voucher rest api | Admin',
    },
    messages: {},
    properties: {},
    resources: {},
  },
};

const locale: Locale = {
  language: 'en',
  translations,
};

export default locale;
