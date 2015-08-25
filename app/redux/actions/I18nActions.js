import { LOCALE_INITIALIZE } from '../constants/ActionTypes';
import * as loaders from 'utils/intl-loader';

import { asyncFuncCreator } from '../utils';

export function change(locale = 'en') {
  return asyncFuncCreator({
    constant: 'LOCALE_CHANGE',
    promise: loaders[locale],
    locale
  });
}

export function initialize(locale, messages) {
  return { type: LOCALE_INITIALIZE, locale, messages };
}
