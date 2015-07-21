import React from 'react';
import Router from 'react-router';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import routes from './routes';
import apiClient from './redux/api-client';
import createStore from './redux/create';

const store = createStore(apiClient, {});
const container = window.document.getElementById('root');
const element = (
  <div>
    <Provider store={store}>
      {() => (
        <Router
          history={new BrowserHistory()}
          routes={routes} />
      )}
    </Provider>
    <DebugPanel top right bottom>
      <DevTools store={store} monitor={LogMonitor} />
    </DebugPanel>
  </div>
);

React.render(element, container);
