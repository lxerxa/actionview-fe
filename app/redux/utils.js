// Utils for removing boilerplate from Redux
import t from './constants/ActionTypes';

export function asyncFuncCreator({ CONSTANT, promise, ...rest }) {
  const types = [t[CONSTANT], t[CONSTANT + '_SUCCESS'], t[CONSTANT + '_FAIL']];
  return { types, promise, ...rest };
}

export function generateAsyncConstants(CONSTANT) {
  return {
    [CONSTANT]: CONSTANT,
    [CONSTANT + '_SUCCESS']: CONSTANT + '_SUCCESS',
    [CONSTANT + '_FAIL']: CONSTANT + '_FAIL'
  };
}
