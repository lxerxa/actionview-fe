import React from 'react';
import { Route } from 'react-router';

export function generateRoute({ paths, component }) {
  return paths.map(function(path) {
    const props = { key: path, path, component };
    if (component.onEnter) props.onEnter = component.onEnter;
    return <Route { ...props } />;
  });
}
