import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { devTools, persistState } from 'redux-devtools';

import createMiddleware from './clientMiddleware';
import * as reducers from './reducers';

const reducer = combineReducers(reducers);

export default function(client, data) {
  const middleware = createMiddleware(client);

  let finalCreateStore;
  if (process.env.BROWSER) {
    finalCreateStore = compose(
      applyMiddleware(middleware),
      devTools(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
      createStore
    );
  } else {
    finalCreateStore = applyMiddleware(middleware)(createStore);
  }

  return finalCreateStore(reducer, data);
}
