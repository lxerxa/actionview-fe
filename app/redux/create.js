import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { devTools, persistState } from 'redux-devtools';

import createMiddleware from './clientMiddleware';
import * as reducers from './reducers';

const reducer = combineReducers(reducers);

export default function(client, data) {
  const finalCreateStore = compose(
    applyMiddleware(createMiddleware(client)),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
    createStore
  );

  return finalCreateStore(reducer, data);
}
