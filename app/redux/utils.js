// Utils for removing boilerplate from Redux
import * as types from './constants/ActionTypes';

export function asyncFuncCreator({CONSTANT, promise, ...rest}) {
  return {
    types: [
      types[CONSTANT],
      types[`${CONSTANT}_SUCCESS`],
      types[`${CONSTANT}_FAIL`]
    ],
    promise,
    ...rest
  };
}

export function generateAsyncConstants(CONSTANT) {
  return {
    [CONSTANT]: CONSTANT,
    [`${CONSTANT}_SUCCESS`]: `${CONSTANT}_SUCCESS`,
    [`${CONSTANT}_FAIL`]: `${CONSTANT}_FAIL`
  };
}
