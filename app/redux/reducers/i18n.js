import t from '../constants/ActionTypes';

const initialState = { messages: {}, locale: 'en' };

export default function i18n(state = initialState, action) {
  const { type, result, locale, messages } = action;

  switch (type) {
    case t.LOCALE_CHANGE:
      return { ...state, loading: true };

    case t.LOCALE_CHANGE_SUCCESS:
      return { messages: result, locale, loading: false };

    case t.LOCALE_CHANGE_FAIL:
      const { error } = result;
      return { ...state, loading: false, error };

    case t.LOCALE_INITIALIZE:
      return { messages, locale };

    default:
      return state;
  }
}
