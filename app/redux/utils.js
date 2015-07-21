// These utils are here to remove boilerplate from Redux
import * as types from './constants/ActionTypes';

export function asyncFuncCreator(CONSTANT, promise) {
  return {
    types: [
      types[CONSTANT],
      types[`${CONSTANT}_SUCCESS`],
      types[`${CONSTANT}_FAIL`]
    ],
    promise
  };
}

export function generateAsyncConstants(CONSTANT) {
  return {
    CONSTANT,
    [`${CONSTANT}_SUCCESS`]: `${CONSTANT}_SUCCESS`,
    [`${CONSTANT}_FAIL`]: `${CONSTANT}_FAIL`
  };
}
