import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';

import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import DevTools from '../utils/dev-tools';
import createMiddleware from './clientMiddleware';
import * as reducers from './reducers';

const { NODE_ENV, BROWSER } = process.env;
const reducer = combineReducers(reducers);

export default function(client, data, history) {
  const middleware = [ thunkMiddleware, createMiddleware(client) ];

  let finalCreateStore;
  if (process.env.BROWSER) {
    middleware.push(routerMiddleware(history));
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore);
  } else {
    finalCreateStore = compose(applyMiddleware(...middleware))(createStore);
  }

  const store = finalCreateStore(reducer, data);

  if (BROWSER && NODE_ENV === 'developement' && module.hot) {
    module.hot.accept('./reducers', () =>
      store.replaceReducer(require('./reducers')));
  }

  return store;
}
