/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'vi', 'zh-hans', 'zh-hant'],
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en',
  },
  catalogs: [
    {
      path: 'i18n/locales/{locale}/messages',
    },
  ],
}
