import serialize from 'serialize-javascript';
import debug from 'debug';

import React from 'react';
import ReactDOM from 'react-dom/server';
import { Provider } from 'react-redux';
import { Router, RouterContext, match } from 'react-router';

import ReduxResolver from './redux-resolver';
import sroutes from '../app/sroutes'; // 临时修改
import * as I18nActions from 'redux/actions/I18nActions';

const { BROWSER, NODE_ENV } = process.env;

const runRouter = (location) =>
  new Promise((resolve) =>
    match({ sroutes, location }, (...args) => resolve(args)));

debug('------------------------');

/* eslint react/display-name:0 */
// see: https://github.com/yannickcr/eslint-plugin-react/issues/256
export default async function({ location, history, store, locale }) {
  const resolver = new ReduxResolver();
  store.resolver = resolver;

  const routes = require('../app/routes');
  return (
    <Provider store={ store }>
      <Router history={ history } routes={ routes } />
    </Provider>
  );
}
