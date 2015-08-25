import serialize from 'serialize-javascript';

import React from 'react';
import Router from 'react-router';
import { Provider } from 'react-redux';

import ReduxResolver from './redux-resolver';
import routes from '../app/routes';

const runRouter = function(location) {
  return new Promise(function(resolve) {
    Router.run(routes, location, function(error, initialState) {
      return resolve({ error, initialState });
    });
  });
};

export default async function({ location, history, store }) {
  const resolver = new ReduxResolver();
  store.resolver = resolver;

  if (process.env.BROWSER) {
    // add redux-devtools on client side
    const { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react');

    return (
      <div>
        <Provider store={ store }>
          { () => <Router history={ history } routes={ routes } /> }
        </Provider>
        <DebugPanel top right bottom>
          <DevTools store={ store } monitor={ LogMonitor } />
        </DebugPanel>
      </div>
    );
  } else {
    const { error, initialState } = await runRouter(location);
    if (error) throw error;

    const props = { location, ...initialState };
    const element = (
      <Provider store={ store }>
        { () => <Router { ...props } /> }
      </Provider>
    );

    // Collect promises with a first render
    React.renderToString(element);
    // Resolve them, populate stores
    await resolver.dispatchPendingActions();
    // Re-render application with data
    const state = serialize(store.getState());
    const body = React.renderToString(element);

    return { body, state };
  }
}
