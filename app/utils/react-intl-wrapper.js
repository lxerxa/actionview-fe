import { IntlMixin } from 'react-intl';

// prevent app to break when translation is missing
// add message a la i18n Rails
export function getIntlMessage(key) {
  try {
    return IntlMixin.getIntlMessage.call(this, key);
  } catch (error) {
    const { locale } = this.props;
    return `translation missing ${locale}: ${key}`;
  }
}
