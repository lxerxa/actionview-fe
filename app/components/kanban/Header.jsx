import React, { PropTypes, Component } from 'react';
import { Button, DropdownButton, MenuItem, Nav, NavItem, ButtonGroup, OverlayTrigger, Popover } from 'react-bootstrap';
import _ from 'lodash';
 
const CreateIssueModal = require('../issue/CreateModal');
const CreateKanbanModal = require('./config/CreateModal');
const EditKanbanModal = require('./config/EditModal');

const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { filter: 'all', createIssueModalShow: false, createKanbanModalShow: false };
    this.getQuery = this.getQuery.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { index, switchRank, curKanban } = nextProps;
    if (this.props.curKanban.id != curKanban.id || !_.isEqual(this.props.curKanban.query, curKanban.query)) {
      this.setState({ filter: 'all' });
      switchRank(true);
      index(this.getQuery(curKanban.query || {}));
    }
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    changeModel: PropTypes.func.isRequired,
    model: PropTypes.string.isRequired,
    create: PropTypes.func.isRequired,
    createKanban: PropTypes.func.isRequired,
    project: PropTypes.object,
    curKanban: PropTypes.object,
    kanbans: PropTypes.array,
    loading: PropTypes.bool,
    goto: PropTypes.func,
    switchRank: PropTypes.func,
    index: PropTypes.func,
    options: PropTypes.object
  }

  createIssueModalClose() {
    this.setState({ createIssueModalShow: false });
  }

  createKanbanModalClose() {
    this.setState({ createKanbanModalShow: false });
  }

  changeKanban(eventKey) {
    if (eventKey === 'create') {
      this.setState({ createKanbanModalShow: true });
    } else {
      const { goto } = this.props;
      goto(eventKey, 'issue');
    }
  }

  getQuery(globalQuery, filterQuery) {
    const gq = globalQuery || {};
    const fq = filterQuery || {};

    const multiValFields = [ 'type', 'priority', 'state', 'resolution', 'assignee', 'reporter', 'module' ];
    const newQuery = {};
    _.forEach(multiValFields, (val) => {
      if (fq[val] && fq[val].length > 0 && gq[val] && gq[val].length > 0) {
        newQuery[val] = _.intersection(fq[val], gq[val]);
        if (newQuery[val].length <= 0) {
          newQuery[val] = [ 'notexists' ];
        }
      } else {
        if (gq[val] && gq[val].length > 0) {
          newQuery[val] = gq[val];
        }
        if (fq[val] && fq[val].length > 0) {
          newQuery[val] = fq[val];
        }
      }
    });

    if (newQuery.type && _.head(newQuery.type) !== 'notexists' && gq.subtask) {
      const subtaskTypes = _.map(_.filter(this.props.options.types, { type: 'subtask' }), (v) => v.id);
      if (subtaskTypes.length > 0) {
        newQuery.type = _.union(newQuery.type, subtaskTypes); 
      }
    }

    if (gq.created_at && fq.created_at) {
      if (gq.created_at == '1w' || fq.created_at == '1w') {
        newQuery['created_at'] = '1w';
      } else if (gq.created_at == '2w' || fq.created_at == '2w') {
        newQuery['created_at'] = '2w';
      } else {
        newQuery['created_at'] = '1m';
      }
    } else {
      newQuery['created_at'] = gq.created_at || fq.created_at;
    }

    if (gq.updated_at && fq.updated_at) {
      if (gq.updated_at == '1w' || fq.updated_at == '1w') {
        newQuery['updated_at'] = '1w';
      } else if (gq.updated_at == '2w' || fq.updated_at == '2w') {
        newQuery['updated_at'] = '2w';
      } else {
        newQuery['updated_at'] = '1m';
      }
    } else {
      newQuery['updated_at'] = gq.updated_at || fq.updated_at;
    }

    return _.mapValues(newQuery, (v) => { if (_.isArray(v)) { return v.join(','); } else { return v; } });
  }

  handleSelect(selectedKey) {
    this.setState({ filter: selectedKey });

    const { index, curKanban, switchRank } = this.props;
    switchRank(selectedKey === 'all');
    index(this.getQuery(curKanban.query || {}, selectedKey === 'all' ? {} : curKanban.filters[selectedKey].query || {}));
  }

  render() {
    const { i18n, changeModel, model, createKanban, curKanban, kanbans=[], loading, project, create, goto, options } = this.props;

    const popoverClickRootClose = (
      <Popover id='popover-trigger-click-root-close'>
        <span>只有过滤器选择“全部”时，才可拖拽改变问题的排序。</span>
      </Popover>);

    return (
      <div style={ { margin: '18px 10px 10px 10px' } }>
        <div style={ { height: '47px' } }>
          <div style={ { display: 'inline-block', fontSize: '19px', marginTop: '5px' } }>
            { loading && <img src={ img } className='loading'/> } 
            { !loading && !_.isEmpty(curKanban) && curKanban.name || '' } 
            { !loading && _.isEmpty(curKanban) && kanbans.length > 0 && '该看板不存在。' } 
            { !loading && _.isEmpty(curKanban) && kanbans.length <= 0 && '该项目未定义看板。' } 
          </div>
          <div style={ { float: 'right', display: 'inline-block' } }>
            { options.permissions && options.permissions.indexOf('create_issue') !== -1 && !_.isEmpty(curKanban) && model === 'issue' &&
            <Button style={ { marginRight: '10px' } } bsStyle='primary' onClick={ () => { this.setState({ createIssueModalShow: true }); } }><i className='fa fa-plus'></i> 创建问题</Button> }
            { !_.isEmpty(curKanban) &&
            <ButtonGroup style={ { marginRight: '10px' } }>
              { curKanban.type == 'kanban' && <Button style={ { backgroundColor: model == 'issue' && '#eee' } } onClick={ () => { changeModel('issue') } }>看板</Button> }
              { curKanban.type == 'scrum' && <Button style={ { backgroundColor: model == 'history' && '#eee' } } onClick={ () => { changeModel('history') } }>历史</Button> }
              { curKanban.type == 'scrum' && <Button style={ { backgroundColor: model == 'backlog' && '#eee' } } onClick={ () => { changeModel('backlog') } }>Backlog</Button> }
              { curKanban.type == 'scrum' && <Button style={ { backgroundColor: model == 'issue' && '#eee' } } onClick={ () => { changeModel('issue') } }>活动Sprint</Button> }
              <Button style={ { backgroundColor: model == 'config' && '#eee' } } onClick={ () => { changeModel('config') } }>配置</Button>
            </ButtonGroup> }
            { (kanbans.length > 0 || (options.permissions && options.permissions.indexOf('manage_project') !== -1)) && 
            <DropdownButton pullRight title='列表' onSelect={ this.changeKanban.bind(this) }>
            { _.map(kanbans, (v, i) => ( <MenuItem key={ i } eventKey={ v.id }>{ v.name }</MenuItem> ) ) }
            { options.permissions && options.permissions.indexOf('manage_project') !== -1 && kanbans.length > 0 && <MenuItem divider/> }
            { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='create'>创建看板</MenuItem> }
            </DropdownButton> } 
          </div>
        </div>

        { model === 'issue' && !loading && !_.isEmpty(curKanban) &&
        <div style={ { height: '45px', borderBottom: '2px solid #f5f5f5' } }>
          <span style={ { float: 'left', marginTop: '7px', marginRight: '10px' } }>
            过滤器
            <OverlayTrigger trigger='click' rootClose placement='bottom' overlay={ popoverClickRootClose }>
              <span style={ { marginLeft: '5px', cursor: 'pointer' } }><i className='fa fa-info-circle'></i></span>
            </OverlayTrigger>
            ：
          </span>
          <Nav bsStyle='pills' style={ { float: 'left', lineHeight: '1.0' } } activeKey={ this.state.filter } onSelect={ this.handleSelect.bind(this) }>
            <NavItem eventKey='all' href='#'>全部</NavItem>
            { _.map(curKanban.filters || [], (v, i) => (<NavItem key={ i } eventKey={ i } href='#'>{ v.name }</NavItem>) ) }
          </Nav>
        </div> }
        { this.state.createKanbanModalShow &&
          <CreateKanbanModal
            show
            close={ this.createKanbanModalClose.bind(this) }
            create={ createKanban }
            goto={ goto }
            kanbans={ kanbans }
            i18n={ i18n }/> }
        { this.state.createIssueModalShow &&
          <CreateIssueModal
            show
            close={ this.createIssueModalClose.bind(this) }
            options={ options }
            create={ create }
            loading={ loading }
            project={ project }
            i18n={ i18n }/> }
      </div>
    );
  }
}
