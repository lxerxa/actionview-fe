import debug from 'debug';
import { IntlMixin as i18n } from 'react-intl';

// prevent app to break when translation is missing
// add message a la i18n Rails
export function getIntlMessage(key, values) {
  try {
    const messages = i18n.getIntlMessage.call(this, key);
    return i18n.formatMessage.call({ ...this, ...i18n }, messages, values);
  } catch (error) {
    debug('dev')(error);
    return `translation missing ${this.props.locale}: ${key}`;
  }
}
