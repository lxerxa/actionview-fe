import serialize from 'serialize-javascript';

import React from 'react';
import ReactDOM from 'react-dom/server';
import { Provider } from 'react-redux';
import Router, { RoutingContext, match } from 'react-router';

import ReduxResolver from './redux-resolver';
import routes from '../app/routes';
import * as I18nActions from 'redux/actions/I18nActions';

const { BROWSER, NODE_ENV } = process.env;

const runRouter = (location) =>
  new Promise((resolve) =>
    match({ routes, location }, (...args) => resolve(args)));

/* eslint react/display-name:0 */
// see: https://github.com/yannickcr/eslint-plugin-react/issues/256
export default async function({ location, history, store, locale }) {
  const resolver = new ReduxResolver();
  store.resolver = resolver;

  if (BROWSER && NODE_ENV === 'development') {
    // add redux-devtools on client side
    const DevTools = require('utils/dev-tools');

    return (
      <div>
        <Provider store={ store }>
          <Router history={ history } routes={ routes } />
        </Provider>
        <Provider store={ store }>
          <DevTools key='dev-tools' />
        </Provider>
      </div>
    );
  } else if (BROWSER) {
    return (
      <Provider store={ store }>
        <Router history={ history } routes={ routes } />
      </Provider>
    );
  } else {
    // Initialize locale of rendering
    try {
      const messages = require(`i18n/${locale}`);
      store.dispatch(I18nActions.initialize(locale, messages));
    } catch (error) {
      store.dispatch(I18nActions.initialize('en', require('i18n/en')));
    }

    const [ error, redirect, renderProps ] = await runRouter(location);
    const routerProps = { ...renderProps, location };

    // TODO: Fix redirection
    if (error || redirect) throw (error || redirect);

    const element = (
      <Provider store={ store }>
        <RoutingContext { ...routerProps } />
      </Provider>
    );

    // Collect promises with a first render
    ReactDOM.renderToString(element);
    // Resolve them, populate stores
    await resolver.dispatchPendingActions();
    // Re-render application with data
    const state = serialize(store.getState());
    const body = ReactDOM.renderToString(element);

    return { body, state };
  }
}
