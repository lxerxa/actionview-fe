import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IntlMixin } from 'react-intl';

export default function connectI18n() {
  return function(DecoratedComponent) {
    class WrapperComponent extends DecoratedComponent {
      // prevent app to break when translation is missing
      // add message a la i18n Rails
      i18n = (key, values) => {
        try {
          const messages = IntlMixin.getIntlMessage.call(this, key);
          return IntlMixin
            .formatMessage.call({ ...this, ...IntlMixin }, messages, values);
        } catch (error) {
          return `translation missing ${this.props.locale}: ${key}`;
        }
      }
    }

    @connect(({ i18n }) => ({ ...i18n }))
    class I18nWrapper extends Component {

      static propTypes = {
        locales: PropTypes.array.isRequired,
        messages: PropTypes.object.isRequired,
        formats: PropTypes.object
      }

      static childContextTypes = {
        locales: PropTypes.array.isRequired,
        messages: PropTypes.object.isRequired,
        formats: PropTypes.object
      }

      getChildContext() {
        const { messages, formats, locales } = this.props;
        return { messages, formats, locales };
      }

      render() {
        return (<WrapperComponent { ...this.props } />);
      }

    }

    return I18nWrapper;
  };
}
