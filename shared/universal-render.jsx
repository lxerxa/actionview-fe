import React from 'react';
import Router from 'react-router';
import { Provider } from 'react-redux';

import routes from '../app/routes';

export default function universalRender(location, history, store) {
  return new Promise((resolve, reject) => {
    if (process.env.BROWSER) {
      // add redux-devtools on client side
      const { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react');

      const element = (
        <div>
          <Provider store={store}>
            {() => (
              <Router
                history={history}
                routes={routes} />
            )}
          </Provider>
          <DebugPanel top right bottom>
            <DevTools store={store} monitor={LogMonitor} />
          </DebugPanel>
        </div>
      );
      return resolve(element);
    } else {
      Router.run(routes, location, function(error, initialState) {
        if (error) return reject(error);
        return resolve(React.renderToString(
          <Provider store={store}>
            {() => (
              <Router
                location={location}
                {...initialState} />
            )}
          </Provider>
        ));
      });
    }
  });
}
