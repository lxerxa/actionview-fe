import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { 
  ecode: 0, 
  list: [], 
  sprintLoading: false, 
  completedSprintNum: 0,
  selectedSprint: {},
  sprints: [],
  indexEpicLoading: false,
  epicLoading: false,
  selectedEpicItem: {},
  epics: [],
  versions: [],
  loading: false, 
  rankLoading: false, 
  configLoading: false, 
  wfactions: [], 
  wfLoading: false, 
  sprintLog: {},
  sprintLogLoading: false,
  draggedIssue: '' };

export default function kanban(state = initialState, action) {
  switch (action.type) {
    case t.KANBAN_LIST_GET:
      return { ...state, loading: true, rankable: true, list: [], sprints: [] };

    case t.KANBAN_LIST_GET_SUCCESS:
      if (action.result.ecode === 0) {
        state.list = action.result.data || [];
        state.completedSprintNum = action.result.options && action.result.options.completed_sprint_num || 0;
        state.sprints = action.result.options && action.result.options.sprints || [];
        state.epics = action.result.options && action.result.options.epics || [];
        state.versions = action.result.options && action.result.options.versions || [];
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.KANBAN_LIST_GET_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.KANBAN_CREATE:
      return { ...state, configLoading: true };

    case t.KANBAN_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.list.push(action.result.data);
      }
      return { ...state, configLoading: false, ecode: action.result.ecode };

    case t.KANBAN_CREATE_FAIL:
      return { ...state, configLoading: false, error: action.error };

    case t.KANBAN_UPDATE:
      return { ...state, configLoading: true };

    case t.KANBAN_UPDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.list, { id: action.result.data.id });
        state.list[ind] = action.result.data;
      }
      return { ...state, configLoading: false, ecode: action.result.ecode };

    case t.KANBAN_UPDATE_FAIL:
      return { ...state, configLoading: false, error: action.error };

    case t.KANBAN_DELETE:
      return { ...state, configLoading: true };

    case t.KANBAN_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.list = _.reject(state.list, { id: action.id });
      }
      return { ...state, configLoading: false, ecode: action.result.ecode };

    case t.TYPE_DELETE_FAIL:
      return { ...state, configLoading: false, error: action.error };

    case t.KANBAN_BACKLOG_ISSUE_DRAG:
      return { ...state, draggedIssue: action.id };

    case t.KANBAN_ISSUE_ACTIONS_GET:
      return { ...state, wfLoading: true, draggedIssue: action.id, wfactions: [] };

    case t.KANBAN_ISSUE_ACTIONS_GET_SUCCESS:
      if (action.result.ecode === 0) {
        state.wfactions = action.result.data;
      }
      return { ...state, wfLoading: false, ecode: action.result.ecode };

    case t.KANBAN_ISSUE_ACTIONS_GET_FAIL:
      return { ...state, wfLoading: false, error: action.error };

    case t.KANBAN_ISSUE_ACTIONS_CLEAN:
      return { ...state, draggedIssue: '', wfactions: [] };

    case t.KANBAN_ISSUE_RANK_SET:
      return { ...state, rankLoading: true };

    case t.KANBAN_ISSUE_RANK_SET_SUCCESS:
      return { ...state, rankLoading: false, ecode: action.result.ecode };

    case t.KANBAN_ISSUE_RANK_SET_FAIL:
      return { ...state, rankLoading: false, error: action.error };

    case t.KANBAN_SPRINT_GET:
      return { ...state, selectedSprint: {} };

    case t.KANBAN_SPRINT_GET_SUCCESS:
      if (action.result.ecode === 0) {
        state.selectedSprint = action.result.data;
      }
      return { ...state, ecode: action.result.ecode };

    case t.KANBAN_SPRINT_GET_FAIL:
      return { ...state, error: action.error };

    case t.KANBAN_BACKLOG_ISSUE_MOVE: 
    case t.KANBAN_SPRINT_CREATE:
    case t.KANBAN_SPRINT_COMPLETE:
    case t.KANBAN_SPRINT_PUBLISH:
    case t.KANBAN_SPRINT_DELETE:
      return { ...state, sprintLoading: true };

    case t.KANBAN_BACKLOG_ISSUE_MOVE_SUCCESS: 
    case t.KANBAN_SPRINT_CREATE_SUCCESS:
    case t.KANBAN_SPRINT_COMPLETE_SUCCESS:
    case t.KANBAN_SPRINT_PUBLISH_SUCCESS:
    case t.KANBAN_SPRINT_DELETE_SUCCESS:
      if (action.result.ecode === 0) {
        state.sprints = action.result.data;
      }
      return { ...state, sprintLoading: false, ecode: action.result.ecode };

    case t.KANBAN_BACKLOG_ISSUE_MOVE_FAIL: 
    case t.KANBAN_SPRINT_CREATE_FAIL:
    case t.KANBAN_SPRINT_COMPLETE_FAIL:
    case t.KANBAN_SPRINT_PUBLISH_FAIL:
    case t.KANBAN_SPRINT_DELETE_FAIL:
      return { ...state, sprintLoading: false, error: action.error };

    case t.KANBAN_SPRINT_LOG_GET:
      return { ...state, sprintLogLoading: true };
    case t.KANBAN_SPRINT_LOG_GET_SUCCESS:
      if (action.result.ecode === 0) {
        state.sprintLog = action.result.data;
      }
      return { ...state, sprintLogLoading: false };
    case t.KANBAN_SPRINT_LOG_GET_FAIL:
      return { ...state, sprintLoading: false, error: action.error };

    case t.KANBAN_EPIC_INDEX:
      return { ...state, epics: [], indexEpicLoading: true };
    case t.KANBAN_EPIC_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.epics = action.result.data;
      }
      return { ...state, indexEpicLoading: false, ecode: action.result.ecode };
    case t.KANBAN_EPIC_INDEX_FAIL:
      return { ...state, indexEpicLoading: false, error: action.error };

    case t.KANBAN_EPIC_CREATE:
    case t.KANBAN_EPIC_EDIT:
    case t.KANBAN_EPIC_DELETE:
      return { ...state, epicLoading: true };

    case t.KANBAN_EPIC_CREATE_SUCCESS:
      if (action.result.ecode === 0) {
        state.epics.push(action.result.data);
      }
      return { ...state, epicLoading: false, ecode: action.result.ecode };

    case t.KANBAN_EPIC_EDIT_SUCCESS:
      if (action.result.ecode === 0) {
        const ind = _.findIndex(state.epics, { id: action.result.data.id });
        _.extend(state.epics[ind], action.result.data);
      }
      return { ...state, epicLoading: false, ecode: action.result.ecode };

    case t.KANBAN_EPIC_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.epics = _.reject(state.epics, { id: action.id });
      }
      return { ...state, epicLoading: false, ecode: action.result.ecode };

    case t.KANBAN_EPIC_CREATE_FAIL:
    case t.KANBAN_EPIC_EDIT_FAIL:
    case t.KANBAN_EPIC_DELETE_FAIL:
      return { ...state, epicLoading: false, error: action.error };

    case t.KANBAN_EPIC_SELECT:
      const el = _.find(state.epics, { id: action.id });
      return { ...state, epicLoading: false, selectedEpicItem: el };

    case t.KANBAN_EPIC_SET_SORT:
      return { ...state, epicLoading: true };

    case t.KANBAN_EPIC_SET_SORT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        if (action.result.data.sequence) {
          const newEpics = [];
          _.map(action.result.data.sequence, (v) => {
            const index = _.findIndex(state.epics, { id: v });
            if (index !== -1) {
              newEpics.push(state.epics[index]);
            }
          });
          state.epics = newEpics;
        }
      }
      return { ...state, epicLoading: false, ecode: action.result.ecode };

    case t.KANBAN_EPIC_SET_SORT_FAIL:
      return { ...state, epicLoading: false, error: action.error };

    default:
      return state;
  }
}
