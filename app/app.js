import debug from 'debug';

import React from 'react';
import BrowserHistory from 'react-router/lib/BrowserHistory';

import apiClient from './redux/api-client';
import createStore from './redux/create';
import universalRender from '../shared/universal-render';

if (process.env.NODE_ENV === 'development') {
  debug.enable('dev');
}

(async function() {
  try {
    const store = createStore(apiClient, {});
    const history = new BrowserHistory();
    const container = window.document.getElementById('root');
    const element = await universalRender(null, history, store);

    return React.render(element, container);
  } catch (error) {
    debug('dev')('Error with first render');
    throw error;
  }
})();
