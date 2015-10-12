// Utils for removing boilerplate from Redux
import at from './constants/ActionTypes';

export function asyncFuncCreator({ constant, ...rest }) {
  return {
    types: [
      at[constant],
      at[constant + '_SUCCESS'],
      at[constant + '_FAIL']
    ],
    ...rest
  };
}

export function generateConstants(constants) {
  return constants.reduce((result, constant) => {
    if (constant.indexOf('(ASYNC)')) {
      const clean = constant.replace('(ASYNC)', '');
      result[clean] = clean;
      result[clean + '_SUCCESS'] = clean + '_SUCCESS';
      result[clean + '_FAIL'] = clean + '_FAIL';
    } else {
      result[constant] = constant;
    }
    return result;
  }, {});
}
