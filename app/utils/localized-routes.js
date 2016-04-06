import React from 'react';
import { Route } from 'react-router';

export function generateRoute({ paths, component }) {
  /* eslint react/display-name:0 */
  // see: https://github.com/yannickcr/eslint-plugin-react/issues/256
  return paths.map(function(path) {
    const customprops = { key: path, path, component };
    if (component.onEnter) { customprops.onEnter = component.onEnter; }
    return <Route { ...customprops } />;
  });
}
