// We need to define `ReactIntl` on the global scope
// in order to load specific locale data from `ReactIntl`
// see: https://github.com/iam4x/isomorphic-flux-boilerplate/issues/64
const { BROWSER } = process.env;
if (BROWSER) window.ReactIntl = require('react-intl');

export function en() {
  return new Promise((resolve) => {
    if (BROWSER) {
      require.ensure([
        'intl',
        'intl/locale-data/jsonp/en',
        'i18n/en.json'
      ], (require) => {
        require('intl');
        require('intl/locale-data/jsonp/en');
        return resolve(require('i18n/en.json'));
      });
    } else {
      return resolve(require('i18n/en.json'));
    }
  });
}

export function fr() {
  return new Promise((resolve) => {
    if (BROWSER) {
      require.ensure([
        'intl',
        'intl/locale-data/jsonp/fr',
        'i18n/fr.json'
      ], (require) => {
        require('intl');
        require('intl/locale-data/jsonp/fr');
        return resolve(require('i18n/fr.json'));
      });
    } else {
      return resolve(require('i18n/fr.json'));
    }
  });
}
