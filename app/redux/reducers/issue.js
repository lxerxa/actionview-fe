import * as t from '../constants/ActionTypes';
import _ from 'lodash';
import { arrange } from '../funcs/fields';

const initialState = { 
  ecode: 0, 
  emsg: '',
  requested_at: 0,
  collection: [], 
  itemData: {}, 
  options: {}, 
  indexLoading: false, 
  visitedCollection: [], 
  visitedIndex: -1, 
  optionsLoading: false, 
  filterLoading: false, 
  columnsLoading: false, 
  loading: false, 
  itemLoading: false, 
  fileLoading: false, 
  commentsCollection: [], 
  commentsSort: 'desc', 
  commentsIndexLoading: false, 
  commentsLoading: false, 
  commentsItemLoading: false, 
  commentsLoaded: false, 
  historyCollection: [], 
  historySort: 'desc', 
  historyIndexLoading: false, 
  historyLoaded: false, 
  gitCommitsCollection: [],
  gitCommitsSort: 'desc',
  gitCommitsIndexLoading: false,
  gitCommitsLoaded: false,
  worklogCollection: [], 
  worklogSort: 'asc', 
  worklogIndexLoading: false, 
  worklogLoading: false, 
  worklogLoaded: false, 
  linkLoading: false,
  rankLoading: false,
  importResult: '',
  detailFloatStyle: {} 
};

export default function issue(state = initialState, action) {
  switch (action.type) {
    case t.ISSUE_INDEX:
      return { ...state, indexLoading: true, itemLoading: false, filterLoading: false, columnsLoading: false, collection: [], requested_at: action.requested_at };

    case t.ISSUE_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        if (action.result.options && action.result.options.requested_at && action.result.options.requested_at < state.requested_at) {
          return { ...state };
        }
        _.assign(state.options, action.result.options || {});
        state.collection = action.result.data;
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.ISSUE_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.ISSUE_OPTIONS:
      state.options.display_columns = [];
      return { ...state, optionsLoading: true };

    case t.ISSUE_OPTIONS_SUCCESS:
      if (action.result.ecode === 0) {
        _.assign(state.options, action.result.data || {});
        state.options.fields = arrange(state.options);
      }
      return { ...state, optionsLoading: false, ecode: action.result.ecode };

    case t.ISSUE_OPTIONS_FAIL:
      return { ...state, optionsLoading: false, error: action.error };

    case t.ISSUE_CREATE:
      return { ...state, loading: true };

    case t.ISSUE_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection.unshift(action.result.data);
        if (!_.isEmpty(state.itemData) && action.result.data.parent_id === state.itemData.id) {
          if (!state.itemData.subtasks) {
            state.itemData.subtasks = [];
          }
          state.itemData.subtasks.push(_.pick(action.result.data, ['id', 'no', 'title', 'type', 'state']));
        }
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.ISSUE_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.ISSUE_COPY:
      return { ...state, loading: true };

    case t.ISSUE_COPY_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection.unshift(action.result.data);
        if (!_.isEmpty(state.itemData) && action.result.data.links.length > 0) {
          _.map(action.result.data.links, (link) => {
            if (state.itemData.id === link.dest.id) {
              if (!state.itemData.links) {
                state.itemData.links = [];
              }
            }
            state.itemData.links.push(action.result.data.links[0]); 
          });
        }
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.ISSUE_COPY_FAIL:
      return { ...state, loading: false, error: action.error };


    case t.ISSUE_EDIT:
    case t.ISSUE_MOVE:
    case t.ISSUE_CONVERT:
      return { ...state, loading: true, historyLoaded: false };

    case t.ISSUE_EDIT_SUCCESS:
    case t.ISSUE_MOVE_SUCCESS:
    case t.ISSUE_CONVERT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        if (ind !== -1) {
          state.collection[ind] = action.result.data;
        }
        _.map(state.collection, (v) => {
          if (v.parent_id === action.result.data.id) {
            if (v.parent && v.parent.id) {
              v.parent.title = action.result.data.title;
            }
          }
        });
        if (!_.isEmpty(state.itemData) && action.result.data.id === state.itemData.id) {
          state.itemData = action.result.data;
        }
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.ISSUE_EDIT_FAIL:
    case t.ISSUE_MOVE_FAIL:
    case t.ISSUE_CONVERT_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.ISSUE_SHOW:
      return { 
        ...state, 
        itemLoading: true, 
        linkLoading: false, 
        detailFloatStyle: action.floatStyle || state.detailFloatStyle, 
        itemData: { id: action.id }, 
        commentsLoaded: false, 
        historyLoaded: false, 
        worklogLoaded: false, 
        gitCommitsLoaded: false 
      };

    case t.ISSUE_SHOW_SUCCESS:
      if (action.result.ecode === 0) {
        state.itemData = action.result.data;
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.ISSUE_SHOW_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.ISSUE_DELETE:
      return { ...state, itemLoading: true };

    case t.ISSUE_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        _.forEach(action.result.data.ids || [], (val) => {
          state.collection = _.reject(state.collection, { id: val });
        });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.ISSUE_DELETE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.ISSUE_FILTER_SAVE:
    case t.ISSUE_FILTERS_CONFIG:
    case t.ISSUE_FILTERS_DEL:
    case t.ISSUE_FILTERS_RESET:
      return { ...state, filterLoading: true };

    case t.ISSUE_FILTER_SAVE_SUCCESS:
    case t.ISSUE_FILTERS_CONFIG_SUCCESS:
    case t.ISSUE_FILTERS_DEL_SUCCESS:
    case t.ISSUE_FILTERS_RESET_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.options.filters = action.result.data;
      }
      return { ...state, filterLoading: false, ecode: action.result.ecode };

    case t.ISSUE_FILTER_SAVE_FAIL:
    case t.ISSUE_FILTERS_CONFIG_FAIL:
    case t.ISSUE_FILTERS_DEL_FAIL:
    case t.ISSUE_FILTERS_RESET_FAIL:
      return { ...state, filterLoading: false, error: action.error };

    case t.ISSUE_LIST_COLUMNS_SET:
    case t.ISSUE_LIST_COLUMNS_RESET:
      return { ...state, columnsLoading: true };

    case t.ISSUE_LIST_COLUMNS_SET_SUCCESS:
    case t.ISSUE_LIST_COLUMNS_RESET_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.options.display_columns = action.result.data;
      }
      return { ...state, columnsLoading: false, ecode: action.result.ecode };

    case t.ISSUE_LIST_COLUMNS_SET_FAIL:
    case t.ISSUE_LIST_COLUMNS_RESET_FAIL:
      return { ...state, columnsLoading: false, error: action.error };

    case t.ISSUE_FILE_DELETE:
      return { ...state, fileLoading: true, historyLoaded: false };

    case t.ISSUE_FILE_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.itemData[action.field_key] = _.reject(state.itemData[action.field_key] || [], { id: action.id });
      }
      return { ...state, fileLoading: false, ecode: action.result.ecode };

    case t.ISSUE_FILE_DELETE_FAIL:
      return { ...state, fileLoading: false, error: action.error };

    case t.ISSUE_FILE_ADD:
      if (!state.itemData[action.field_key]) {
        state.itemData[action.field_key] = [];
      }
      state.itemData[action.field_key].push(action.file);
      return { ...state, itemData: state.itemData, historyLoaded: false };

    case t.ISSUE_WORKFLOW_ACTION:
      return { ...state, itemLoading: !action.screen, loading: action.screen, historyLoaded: false, commentsLoaded: false };

    case t.ISSUE_ADD_LABELS:
      const addLabels = _.map(_.filter(action.newLabels, (v) => _.findIndex(state.options.labels, { name: v }) === -1), (v) => { return { name: v, bgColor: '' } })
      if (addLabels.length > 0) {
        state.options.labels = addLabels.concat(state.options.labels);
      }
      return { ...state, options: state.options };

    case t.ISSUE_SET_ASSIGNEE:
      return { ...state, historyLoaded: false, itemLoading: !action.modelFlag };

    case t.ISSUE_SET_ITEM_VALUE:
      return { ...state, historyLoaded: false, itemLoading: true };

    case t.ISSUE_SET_LABELS:
      return { ...state, historyLoaded: false };

    case t.ISSUE_STATE_RESET:
      return { ...state, itemLoading: true, historyLoaded: false };

    case t.ISSUE_WORKFLOW_ACTION_SUCCESS:
    case t.ISSUE_STATE_RESET_SUCCESS:
    case t.ISSUE_SET_ASSIGNEE_SUCCESS:
    case t.ISSUE_SET_ITEM_VALUE_SUCCESS:
    case t.ISSUE_SET_LABELS_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        if (ind !== -1) {
          _.extend(state.collection[ind], action.result.data);
        }
        if (!_.isEmpty(state.itemData) && action.result.data.id === state.itemData.id) {
          _.extend(state.itemData, action.result.data);
        }
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.ISSUE_WORKFLOW_ACTION_FAIL:
    case t.ISSUE_STATE_RESET_FAIL:
    case t.ISSUE_SET_ASSIGNEE_FAIL:
    case t.ISSUE_SET_ITEM_VALUE_FAIL:
    case t.ISSUE_SET_LABELS_FAIL:
      return { ...state, itemLoading: false, loading: false, error: action.error };

    case t.ISSUE_COMMENTS_INDEX:
      return { ...state, commentsIndexLoading: true, commentsLoading: false, commentsCollection: [] };

    case t.ISSUE_COMMENTS_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.commentsCollection = action.result.data;
        _.assign(state.options, action.result.options || {});

        state.itemData.comments_num = 0;
        _.forEach(state.commentsCollection, (v) => {
          state.itemData.comments_num += 1;
          if (v.reply) {
            state.itemData.comments_num += v.reply.length;
          }
        });
      }
      return { ...state, commentsIndexLoading: false, commentsLoaded: true, ecode: action.result.ecode };

    case t.ISSUE_COMMENTS_INDEX_FAIL:
      return { ...state, commentsIndexLoading: false, error: action.error };

    case t.ISSUE_COMMENTS_SORT:
      state.commentsCollection.reverse();
      return { ...state, commentsSort: state.commentsSort === 'desc' ? 'asc' : 'desc' };

    case t.ISSUE_COMMENTS_ADD:
      return { ...state, commentsLoading: true };

    case t.ISSUE_COMMENTS_ADD_SUCCESS:
      if ( action.result.ecode === 0 ) {
        if (state.commentsSort === 'asc') {
          state.commentsCollection.push(action.result.data);
        } else {
          state.commentsCollection.unshift(action.result.data);
        }
        if (state.itemData.comments_num) {
          state.itemData.comments_num += 1;
        } else {
          state.itemData.comments_num = 1;
        }
      }
      return { ...state, commentsLoading: false, ecode: action.result.ecode };

    case t.ISSUE_COMMENTS_ADD_FAIL:
      return { ...state, commentsLoading: false, error: action.error };

    case t.ISSUE_COMMENTS_EDIT:
      return { ...state, commentsItemLoading: true };

    case t.ISSUE_COMMENTS_EDIT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.commentsCollection, { id: action.result.data.id });
        state.commentsCollection[ind] = action.result.data;

        state.itemData.comments_num = 0;
        _.forEach(state.commentsCollection, (v) => {
          state.itemData.comments_num += 1;
          if (v.reply) {
            state.itemData.comments_num += v.reply.length;
          }
        });
      }
      return { ...state, commentsItemLoading: false, ecode: action.result.ecode };

    case t.ISSUE_COMMENTS_EDIT_FAIL:
      return { ...state, commentsItemLoading: false, error: action.error };

    case t.ISSUE_COMMENTS_DELETE:
      return { ...state, commentsItemLoading: true };

    case t.ISSUE_COMMENTS_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.commentsCollection = _.reject(state.commentsCollection, { id: action.id });

        state.itemData.comments_num = 0;
        _.forEach(state.commentsCollection, (v) => {
          state.itemData.comments_num += 1;
          if (v.reply) {
            state.itemData.comments_num += v.reply.length;
          }
        });
      }
      return { ...state, commentsItemLoading: false, ecode: action.result.ecode };

    case t.ISSUE_COMMENTS_DELETE_FAIL:
      return { ...state, commentsItemLoading: false, error: action.error };

    case t.ISSUE_HISTORY_INDEX:
      return { ...state, historyIndexLoading: true, historyCollection: [] };

    case t.ISSUE_HISTORY_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.historyCollection = action.result.data;
        _.assign(state.options, action.result.options || {});
      }
      return { ...state, historyIndexLoading: false, historyLoaded: true, ecode: action.result.ecode };

    case t.ISSUE_HISTORY_INDEX_FAIL:
      return { ...state, historyIndexLoading: false, error: action.error };

    case t.ISSUE_HISTORY_SORT:
      state.historyCollection.reverse();
      return { ...state, historySort: state.historySort === 'desc' ? 'asc' : 'desc' };

    case t.ISSUE_GITCOMMITS_INDEX:
      return { ...state, gitCommitsIndexLoading: true, gitCommitsCollection: [] };

    case t.ISSUE_GITCOMMITS_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.gitCommitsCollection = action.result.data;
        _.assign(state.options, action.result.options || {});
        state.itemData.gitcommits_num = state.gitCommitsCollection.length; 
      }
      return { ...state, gitCommitsIndexLoading: false, gitCommitsLoaded: true, ecode: action.result.ecode };

    case t.ISSUE_GITCOMMITS_INDEX_FAIL:
      return { ...state, gitCommitsIndexLoading: false, error: action.error };

    case t.ISSUE_GITCOMMITS_SORT:
      state.gitCommitsCollection.reverse();
      return { ...state, gitCommitsSort: state.gitCommitsSort === 'desc' ? 'asc' : 'desc' };

    case t.ISSUE_WORKLOG_INDEX:
      return { ...state, worklogIndexLoading: true, worklogLoading: false, worklogCollection: [] };

    case t.ISSUE_WORKLOG_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.worklogCollection = action.result.data;
        _.assign(state.options, action.result.options || {});
        state.itemData.worklogs_num = state.worklogCollection.length; 
      }
      return { ...state, worklogIndexLoading: false, worklogLoaded: true, ecode: action.result.ecode };

    case t.ISSUE_WORKLOG_INDEX_FAIL:
      return { ...state, worklogIndexLoading: false, error: action.error };

    case t.ISSUE_WORKLOG_SORT:
      state.worklogCollection.reverse();
      return { ...state, worklogSort: state.worklogSort === 'asc' ? 'desc' : 'asc' };

    case t.ISSUE_WORKLOG_ADD:
      return { ...state, worklogLoading: true };

    case t.ISSUE_WORKLOG_ADD_SUCCESS:
      if ( action.result.ecode === 0 ) {
        if (state.worklogSort === 'desc') {
          state.worklogCollection.unshift(action.result.data);
        } else {
          state.worklogCollection.push(action.result.data);
        }
        if (state.itemData.worklogs_num) {
          state.itemData.worklogs_num += 1;
        } else {
          state.itemData.worklogs_num = 1;
        }
      }
      return { ...state, worklogLoading: false, ecode: action.result.ecode };

    case t.ISSUE_WORKLOG_ADD_FAIL:
      return { ...state, worklogLoading: false, error: action.error };

    case t.ISSUE_WORKLOG_EDIT:
      return { ...state, worklogLoading: true };

    case t.ISSUE_WORKLOG_EDIT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.worklogCollection, { id: action.result.data.id });
        state.worklogCollection[ind] = action.result.data;
      }
      return { ...state, worklogLoading: false, ecode: action.result.ecode };

    case t.ISSUE_WORKLOG_EDIT_FAIL:
      return { ...state, worklogLoading: false, error: action.error };

    case t.ISSUE_WORKLOG_DELETE:
      return { ...state, worklogLoading: true };

    case t.ISSUE_WORKLOG_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.worklogCollection = _.reject(state.worklogCollection, { id: action.id });
        if (state.itemData.worklogs_num > 0) {
          state.itemData.worklogs_num -= 1;
        } else {
          state.itemData.worklogs_num = 0;
        }
      }
      return { ...state, worklogCollection: state.worklogCollection, worklogLoading: false, ecode: action.result.ecode };

    case t.ISSUE_WORKLOG_DELETE_FAIL:
      return { ...state, worklogLoading: false, error: action.error };

    case t.ISSUE_RECORD:
      const forwardIndex = _.add(state.visitedIndex, 1);
      if (state.visitedCollection[forwardIndex]) {
        state.visitedCollection.splice(forwardIndex);
      }
      if (state.visitedCollection[state.visitedIndex] !== state.itemData.id) {
        state.visitedCollection.push(state.itemData.id);
      }
      return { ...state, visitedCollection: state.visitedCollection, visitedIndex: state.visitedCollection.length - 1 };

    case t.ISSUE_FORWARD:
      return { ...state, visitedIndex: _.add(state.visitedIndex, action.offset || 0) };

    case t.ISSUE_CLEAN_RECORD:
      return { ...state, visitedIndex: -1, visitedCollection: [], itemLoading: false };

    case t.ISSUE_LINK_CREATE:
      return { ...state, linkLoading: true };

    case t.ISSUE_LINK_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        if (!_.isEmpty(state.itemData) && action.result.data.src.id === state.itemData.id) {
          if (!state.itemData.links) {
            state.itemData.links = [];
          }
          state.itemData.links.push(action.result.data);
        }

        // for ganttview
        const ind = _.findIndex(state.collection, { id: action.result.data.src.id });
        if (ind !== -1) {
          if (!state.collection[ind].links) {
            state.collection[ind].links = [];
          }
          state.collection[ind].links.push(action.result.data);
        }
      }
      return { ...state, linkLoading: false, ecode: action.result.ecode };

    case t.ISSUE_LINK_CREATE_FAIL:
      return { ...state, linkLoading: false, error: action.error };

    case t.ISSUE_LINK_DELETE:
      return { ...state, linkLoading: true };

    case t.ISSUE_LINK_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        if (!_.isEmpty(state.itemData) && state.itemData.links && state.itemData.links.length > 0) {
          const linkIndex = _.findIndex(state.itemData.links, { id : action.id });
          if (linkIndex > -1) {
            state.itemData.links.splice(linkIndex, 1);
          }
        }

        // for ganttview
        _.forEach(state.collection, (v) => {
          _.forEach(v.links || [], (v2, i) => {
            if (v2.id == action.id) {
              v.links.splice(i, 1);
            }
          });
        });
      }
      return { ...state, linkLoading: false, ecode: action.result.ecode };

    case t.ISSUE_LINK_DELETE_FAIL:
      return { ...state, linkLoading: false, error: action.error };

    case t.ISSUE_WATCHING_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        if (ind !== -1) {
          state.collection[ind].watching = action.result.data.watching;
        }
        if (!_.isEmpty(state.itemData) && action.result.data.id === state.itemData.id) {
          state.itemData.watching = action.result.data.watching;
          if (action.result.data.user) {
            if (!state.itemData.watchers) {
              state.itemData.watchers = [];
            }
            if (state.itemData.watching) {
              state.itemData.watchers.unshift(action.result.data.user);
            } else {
              const ui = _.findIndex(state.itemData.watchers, { id: action.result.data.user.id });
              if (ui !== -1) {
                state.itemData.watchers.splice(ui, 1);
              }
            }
          }
        }
      }
      return { ...state, ecode: action.result.ecode };

    case t.ISSUE_SPRINT_REMOVE_ISSUE:
      const collection = _.reject(state.collection, (v) => action.issue === v.no);
      return { ...state, collection };

    case t.ISSUE_KANBAN_RANK_SET:
      return { ...state, rankLoading: true };

    case t.ISSUE_KANBAN_RANK_SET_SUCCESS:
      if (action.result.ecode === 0 && action.result.data.rank && action.result.data.rank.length > 0) {
        const newCollection = [];
        _.forEach(action.result.data.rank, (no) => {
          const issue = _.find(state.collection, { no });
          if (issue) {
            newCollection.push(issue);
          }
        });
        return { ...state, collection: newCollection, rankLoading: false };
      }
      return { ...state, rankLoading: false };

    case t.ISSUE_KANBAN_RANK_SET_FAIL:
      return { ...state, rankLoading: false, error: action.error };

    case t.ISSUE_KANBAN_RELEASE:
      return { ...state, itemLoading: true };

    case t.ISSUE_KANBAN_RELEASE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        _.forEach(action.result.data.ids || [], (val) => {
          state.collection = _.reject(state.collection, { id: val });
        });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.ISSUE_KANBAN_RELEASE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.ISSUE_IMPORTS:
      return { ...state, loading: true, emsg: '' };

    case t.ISSUE_IMPORTS_SUCCESS:
      if (action.result.ecode !== 0) {
        state.emsg = action.result.emsg;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.ISSUE_IMPORTS_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.ISSUE_MULTI_EDIT:
    case t.ISSUE_MULTI_DELETE:
    case t.ISSUE_MULTI_STATE_RESET:
      return { ...state, loading: true };

    case t.ISSUE_MULTI_EDIT_SUCCESS:
    case t.ISSUE_MULTI_STATE_RESET_SUCCESS:
    case t.ISSUE_MULTI_DELETE_SUCCESS:
      //if (action.result.ecode === 0) {
      //  _.forEach(action.result.data || [] , (v) => {
      //    const ind = _.findIndex(state.collection, { id: v.id });
      //    if (ind !== -1) {
      //      state.collection[ind] = v;
      //    }
      //    if (!_.isEmpty(state.itemData) && v.id === state.itemData.id) {
      //      state.itemData = v;
      //    }
      //  });
      //}
      return { ...state, loading: false, ecode: action.result.ecode };

    //case t.ISSUE_MULTI_DELETE_SUCCESS:
    //  if (action.result.ecode === 0) {
    //    const ids = action.result.data.ids || [];
    //    state.collection = _.reject(state.collection, (v) => ids.indexOf(v.id) !== -1);
    //  }
    //  return { ...state, loading: false, ecode: action.result.ecode };

    case t.ISSUE_MULTI_EDIT_FAIL:
    case t.ISSUE_MULTI_DELETE_FAIL:
    case t.ISSUE_MULTI_STATE_RESET_FAIL:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
