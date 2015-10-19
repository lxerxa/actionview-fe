import at from '../constants/ActionTypes';

const initialState = { messages: {}, formats: {}, locales: [ 'en' ] };

export default function i18n(state = initialState, action) {
  const { type, result, locale, messages } = action;

  switch (type) {
    case at.LOCALE_CHANGE:
      return { ...state, loading: true };

    case at.LOCALE_CHANGE_SUCCESS:
      return { ...state, messages: result, locales: [ locale ], loading: false };

    case at.LOCALE_CHANGE_FAIL:
      const { error } = result;
      return { ...state, loading: false, error };

    case at.LOCALE_INITIALIZE:
      return { ...state, messages, locales: [ locale ] };

    default:
      return state;
  }
}
