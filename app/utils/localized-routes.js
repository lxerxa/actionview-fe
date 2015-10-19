import React from 'react';
import { Route } from 'react-router';

export function generateRoute({ paths, component }) {
  /* eslint react/display-name:0 */
  // see: https://github.com/yannickcr/eslint-plugin-react/issues/256
  return paths.map(function(path) {
    const props = { key: path, path, component };
    if (component.onEnter) props.onEnter = component.onEnter;
    return <Route { ...props } />;
  });
}
