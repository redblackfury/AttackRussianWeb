import { createI18n } from 'vue-i18n'

function requireAll(r) {
  return r.keys().reduce((acc, filename) => {
    const lang = /\.\/(.+)\.js$/.exec(filename)[1];
    acc[lang] = r(filename).default;
    return acc;
  }, {});
}
const messages = requireAll(require.context('./lang/', true, /\.js$/));

const i18n = new createI18n({
  locale: 'en',
  messages,
});

export default i18n;
