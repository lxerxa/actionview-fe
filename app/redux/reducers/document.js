import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], optionsLoading: false, indexLoading: false, itemLoading: false, item: {}, loading: false, options: {}, selectedItem: {} };

export default function document(state = initialState, action) {
  switch (action.type) {
    case t.DOCUMENT_INDEX:
      return { ...state, indexLoading: true, collection: [], increaseCollection: [] };

    case t.DOCUMENT_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = action.result.data;
        state.options = _.extend(state.options, action.result.options);
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.DOCUMENT_OPTIONS:
      return { ...state, optionsLoading: true, options: {} };

    case t.DOCUMENT_OPTIONS_SUCCESS:
      if (action.result.ecode === 0) {
        state.options = _.extend(state.options, action.result.data);
      }
      return { ...state, optionsLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_OPTIONS_FAIL:
      return { ...state, optionsLoading: false, error: action.error };

    case t.DOCUMENT_CREATE_FOLDER:
      return { ...state, itemLoading: true };

    case t.DOCUMENT_CREATE_FOLDER_SUCCESS:
      if ( action.result.ecode === 0 ) { 
        console.log(action.result.data);
        state.collection.unshift(action.result.data);
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_CREATE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.DOCUMENT_UPDATE:
    case t.DOCUMENT_DELETE:
      return { ...state, itemLoading: true };

    case t.DOCUMENT_UPDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_DELETE_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_DELETE_FAIL:
    case t.DOCUMENT_UPDATE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.DOCUMENT_SELECT:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, selectedItem: el };

    case t.DOCUMENT_ADD:
      state.collection.push(action.file);
      return { ...state };

    default:
      return state;
  }
}
