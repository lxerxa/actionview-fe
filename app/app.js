import debug from 'debug';

import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';

import createStore from './redux/create';
import ApiClient from '../shared/api-client';
import universalRender from '../shared/universal-render';
import { syncHistoryWithStore } from 'react-router-redux';

const { NODE_ENV, BROWSER } = process.env;

if (NODE_ENV !== 'production') debug.enable('dev');

if (BROWSER) {
  require('font-awesome/css/font-awesome.css');
  require('bootstrap/dist/css/bootstrap.css');
  require('jackblog-sass/dist/index.css');
  require('react-bootstrap-table/css/react-bootstrap-table.css');
  require('assets/styles/app.css');
}

(async function() {
  try {
    const store = createStore(new ApiClient(), window.__state, browserHistory);
    const history = syncHistoryWithStore(browserHistory, store);

    const container = window.document.getElementById('content');
    const element = await universalRender({ history, store });

    // render application in browser
    ReactDOM.render(element, container);

    // clean state of `redux-resolver`
    store.resolver.firstRender = false;
    store.resolver.pendingActions = [];
  } catch (error) {
    debug('dev')('Error with first render');
    throw error;
  }
})();
