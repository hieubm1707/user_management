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
    resources: {
      salaries: {
        properties: {
          userid: 'Email', // custom column name for salary table
        },
      },
    },
  },
};

const locale: Locale = {
  language: 'en',
  translations,
};

export default locale;
