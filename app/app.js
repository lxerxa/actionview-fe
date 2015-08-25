import debug from 'debug';

import React from 'react';
import BrowserHistory from 'react-router/lib/BrowserHistory';

import createStore from './redux/create';
import ApiClient from '../shared/api-client';
import universalRender from '../shared/universal-render';

const { NODE_ENV, BROWSER } = process.env;

if (NODE_ENV !== 'production') {
  debug.enable('dev');
}

if (BROWSER) {
  require('styles/app.css');
}

(async function() {
  try {
    const store = createStore(new ApiClient(), window.__state);
    const history = new BrowserHistory();
    const container = window.document.getElementById('content');
    const element = await universalRender({ history, store });

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
