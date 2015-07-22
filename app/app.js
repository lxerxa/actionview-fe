import debug from 'debug';

import React from 'react';
import BrowserHistory from 'react-router/lib/BrowserHistory';

import apiClient from './redux/api-client';
import createStore from './redux/create';
import universalRender from '../shared/universal-render';

if (process.env.NODE_ENV !== 'production') {
  debug.enable('dev');
}

(async function() {
  try {
    const store = createStore(apiClient, window.__initialState);
    const history = new BrowserHistory();
    const container = window.document.getElementById('content');
    const element = await universalRender({history, store});

    // render application in browser
    React.render(element, container);

    // clean state of `redux-resolver`
    store.resolver.firstRender = false;
    store.resolver.pendingActions = [];
  } catch (error) {
    debug('dev')('Error with first render');
    throw error;
  }
})();
