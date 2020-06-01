import React, { PropTypes, Component } from 'react';
import { Button, DropdownButton, ControlLabel, MenuItem, Nav, NavItem, ButtonGroup, OverlayTrigger, Popover, Grid, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
 
const CreateIssueModal = require('../issue/CreateModal');
const CreateKanbanModal = require('./config/CreateModal');
const EditKanbanModal = require('./config/EditModal');
const CreateEpicModal = require('./epic/CreateModal');
const SortCardsModal = require('../share/SortCardsModal');
const MoreFilterModal = require('./MoreFilterModal');
const BurndownModal = require('./BurndownModal');

const $ = require('$');
const moment = require('moment');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);

    const storage = window.localStorage;
    let ev = 'epic';
    if (storage && storage.getItem(props.project.key + '-backlog-filter-mode') === 'version') {
      ev = 'version';
    }

    this.state = { 
      query: {},
      hideHeader: false, 
      backlogFilterMode: ev,
      createIssueModalShow: false, 
      createKanbanModalShow: false, 
      createEpicModalShow: false, 
      sortCardsModalShow: false,
      burndownModalShow: false,
      moreFilterModalShow: false, 
      hisBurndownModalShow: false 
    };

    this.changeModel = this.changeModel.bind(this);
    this.changeFilterMode = this.changeFilterMode.bind(this);
  }

  async componentWillReceiveProps(nextProps) {
    const { index, changeModel, selectFilter, curKanban } = nextProps;
    if (this.props.curKanban.id != curKanban.id || !_.isEqual(this.props.curKanban.query, curKanban.query)) {
      await changeModel('issue');
      await selectFilter('all');
      this.state.query = {};
      index();
    }
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    changeModel: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,
    selectedFilter: PropTypes.string.isRequired,
    create: PropTypes.func.isRequired,
    addLabels: PropTypes.func.isRequired,
    createKanban: PropTypes.func.isRequired,
    getSprint: PropTypes.func.isRequired,
    createSprint: PropTypes.func.isRequired,
    createEpic: PropTypes.func.isRequired,
    setEpicSort: PropTypes.func.isRequired,
    project: PropTypes.object,
    curKanban: PropTypes.object,
    kanbans: PropTypes.array,
    completedSprintNum: PropTypes.number,
    selectedSprint: PropTypes.object,
    sprints: PropTypes.array,
    epics: PropTypes.array,
    versions: PropTypes.array,
    loading: PropTypes.bool,
    epicLoading: PropTypes.bool,
    indexEpicLoading: PropTypes.bool,
    getSprintLog: PropTypes.func,
    sprintLog: PropTypes.object,
    sprintLogLoading: PropTypes.bool,
    goto: PropTypes.func,
    selectFilter: PropTypes.func,
    index: PropTypes.func,
    options: PropTypes.object
  }

  createIssueModalClose() {
    this.setState({ createIssueModalShow: false });
  }

  createKanbanModalClose() {
    this.setState({ createKanbanModalShow: false });
  }

  createEpicModalClose() {
    this.setState({ createEpicModalShow: false });
  }

  sortCardsModalClose() {
    this.setState({ sortCardsModalShow: false });
  }

  moreFilterModalClose() {
    this.setState({ moreFilterModalShow: false });
  }

  burndownModalClose() {
    this.setState({ burndownModalShow: false });
  }

  hisBurndownModalClose() {
    this.setState({ hisBurndownModalShow: false });
  }

  changeKanban(eventKey) {
    if (eventKey === 'create') {
      this.setState({ createKanbanModalShow: true });
    } else {
      const { goto } = this.props;
      goto(eventKey);
    }
  }

  async handleSelect(selectedKey) {
    const { index, curKanban, selectFilter } = this.props;
    this.state.query = selectedKey === 'all' ? {} : curKanban.filters[selectedKey].query;
    await selectFilter(selectedKey);
    index(this.state.query);
  }

  showHeader() {
    this.setState({ hideHeader: false });
    const winHeight = $(window).height();
    $('.board-container').css('height', winHeight - 120 - 50);
  }

  hideHeader() {
    this.setState({ hideHeader: true });
    const winHeight = $(window).height();
    $('.board-container').css('height', winHeight - 28 - 50);
  }

  async changeModel(mode) {
    const { changeModel, selectFilter, index, curKanban, getSprint, completedSprintNum } = this.props;
    await changeModel(mode);
    if (mode == 'issue' || mode == 'backlog') {
      await selectFilter('all');
      this.state.query = {};
      index();
    } else if (mode == 'history') {
      await selectFilter(completedSprintNum + '');
      index({ sprints: completedSprintNum });
      getSprint(completedSprintNum);
    }
  }

  async handleSelectEV(key, mode) {
    if (mode) {
      this.state.backlogFilterMode = mode;
    }
    const { index, curKanban, selectFilter } = this.props;
    await selectFilter(key || 'all');
    index(key ? (this.state.backlogFilterMode === 'epic' ? { epic: key } : { resolve_version: key }) : {});
  }

  async handleSelectSprint(key) {
    const { index, curKanban, selectFilter, completedSprintNum, getSprint } = this.props;
    await selectFilter(key || completedSprintNum);
    index({ sprints: key });
    getSprint(key);
  }

  async changeFilterMode() {

    await this.setState({ backlogFilterMode : this.state.backlogFilterMode === 'epic' ? 'version' : 'epic' });

    const { index, curKanban, selectFilter, selectedFilter, project } = this.props;
    const storage = window.localStorage;
    if (storage) {
      storage.setItem(project.key + '-backlog-filter-mode', this.state.backlogFilterMode);
    }

    await selectFilter('all');
    if (selectedFilter != 'all') {
      index();
    }
  }

  moreSearch(query) {
    const { index, selectFilter } = this.props;
    selectFilter(_.isEmpty(query) ? 'all' : 'more');
    this.setState({ query });
    index(query);
  }

  render() {
    const { 
      i18n, 
      changeModel, 
      mode, 
      selectFilter,
      selectedFilter,
      createKanban, 
      curKanban, 
      kanbans=[], 
      createSprint, 
      completedSprintNum=0,
      selectedSprint={},
      sprints=[],
      createEpic, 
      setEpicSort,
      epics=[],
      versions=[],
      loading, 
      epicLoading, 
      indexEpicLoading, 
      getSprintLog,
      sprintLog={},
      sprintLogLoading, 
      project, 
      index,
      create, 
      addLabels,
      goto, 
      options 
    } = this.props;

    const epicOptions = _.map(epics, (val) => { return { label: val.name, value: val.id } });
    const versionOptions = _.map(versions, (val) => { return { label: val.name, value: val.id } });

    const completedSprintOptions = [];
    for (let i = completedSprintNum; i > 0; i--) {
      completedSprintOptions.push({ label: 'Sprint ' + i , value: '' + i });
    }

    let popoverSprint = '';
    let hisPopoverSprint = '';
    let activeSprint = {};
    if (curKanban.type == 'scrum' && mode == 'issue') {
      activeSprint = _.find(sprints || [], { status: 'active' });
      if (activeSprint) {
        popoverSprint = (
          <Popover id='popover-trigger-click' style={ { maxWidth: '500px', padding: '15px 0px' } }>
            <Grid>
              <Row>
                <Col sm={ 3 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>名称</Col>
                <Col sm={ 9 }>Sprint { activeSprint.no || '' }</Col>
              </Row>
              <Row>
                <Col sm={ 3 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>开始时间</Col>
                <Col sm={ 9 }>{ moment.unix(activeSprint.start_time).format('YYYY/MM/DD') }</Col>
              </Row>
              <Row>
                <Col sm={ 3 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>结束时间</Col>
                <Col sm={ 9 }>{ moment.unix(activeSprint.complete_time).format('YYYY/MM/DD') }</Col>
              </Row>
              <Row>
                <Col sm={ 3 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>描述</Col>
                <Col sm={ 9 } style={ { overflowY: 'scroll', maxHeight: '450px' } } dangerouslySetInnerHTML={ { __html: _.escape(activeSprint.description || '-').replace(/(\r\n)|(\n)/g, '<br/>') } }/>
              </Row>
            </Grid>
          </Popover>);
      }
    } else if (curKanban.type == 'scrum' && mode == 'history') {
      hisPopoverSprint = (
        <Popover id='popover-trigger-click' style={ { maxWidth: '500px', padding: '15px 0px' } }>
          <Grid>
            <Row>
              <Col sm={ 3 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>名称</Col>
              <Col sm={ 9 }>Sprint { selectedSprint.no || '' }</Col>
            </Row>
            <Row>
              <Col sm={ 3 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>期间</Col>
              <Col sm={ 9 }>
                { selectedSprint.start_time && moment.unix(selectedSprint.start_time).format('YYYY/MM/DD') }
                <span style={ { margin: '0 4px' } }>～</span>
                { selectedSprint.complete_time && moment.unix(selectedSprint.complete_time).format('YYYY/MM/DD') }
              </Col>
            </Row>
            <Row>
              <Col sm={ 3 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>实际完成时间</Col>
              <Col sm={ 9 }>{ selectedSprint.real_complete_time && moment.unix(selectedSprint.real_complete_time).format('YYYY/MM/DD HH:mm') }</Col>
            </Row>
            <Row>
              <Col sm={ 3 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>描述</Col>
              <Col sm={ 9 } style={ { overflowY: 'scroll', maxHeight: '450px' } } dangerouslySetInnerHTML={ { __html: _.escape(selectedSprint.description || '-').replace(/(\r\n)|(\n)/g, '<br/>') } }/>
            </Row>
          </Grid>
        </Popover>);
    }

    return (
      <div style={ { margin: '16px 10px 10px 10px' } }>
        <div style={ { height: '0px', display: this.state.hideHeader ? 'block' : 'none', textAlign: 'right' } }>
          <span title='展示看板头'>
            <Button onClick={ this.showHeader.bind(this) } style={ { marginTop: '-37px' } }><i className='fa fa-angle-double-down' aria-hidden='true'></i></Button>
          </span>
        </div>
        <div id='main-header' style={ { height: '49px', display: this.state.hideHeader ? 'none': 'block' } }>
          <div style={ { display: 'inline-block', fontSize: '19px', marginTop: '5px' } }>
            { loading && <img src={ img } className='loading'/> } 
            { !loading && !_.isEmpty(curKanban) && curKanban.name || '' } 
            { !loading && _.isEmpty(curKanban) && kanbans.length > 0 && <span style={ { fontSize: '14px' } }>该看板不存在，请重试或选择其它看板。</span> } 
            { !loading && _.isEmpty(curKanban) && kanbans.length <= 0 && 
            <span style={ { fontSize: '14px' } }>
              该项目暂未定义看板，
              { options.permissions && options.permissions.indexOf('manage_project') !== -1 ? <span>请点击 <a href='#' onClick={ (e) => { e.preventDefault(); this.setState({ createKanbanModalShow: true }); } }>创建看板</a>。</span> : '请联系项目管理员创建。' }
            </span> } 
          </div>
          <div style={ { float: 'right', display: 'inline-block' } }>
            { options.permissions && options.permissions.indexOf('create_issue') !== -1 && !_.isEmpty(curKanban) && ((curKanban.type == 'kanban' && mode === 'issue') || mode === 'backlog') &&
            <Button style={ { marginRight: '10px' } } bsStyle='primary' onClick={ () => { this.setState({ createIssueModalShow: true }); } }><i className='fa fa-plus'></i> 创建问题</Button> }
            { !_.isEmpty(curKanban) &&
            <ButtonGroup style={ { marginRight: '10px' } }>
              { curKanban.type == 'kanban' && <Button style={ { backgroundColor: mode == 'issue' && '#eee' } } onClick={ () => { this.changeModel('issue') } }>看板</Button> }
              { curKanban.type == 'scrum' && <Button style={ { backgroundColor: mode == 'epic' && '#eee' } } onClick={ () => { this.changeModel('epic') } }>Epic</Button> }
              { curKanban.type == 'scrum' && completedSprintNum > 0 && <Button style={ { backgroundColor: mode == 'history' && '#eee' } } onClick={ () => { this.changeModel('history') } }>Sprint 历史</Button> }
              { curKanban.type == 'scrum' && <Button style={ { backgroundColor: mode == 'backlog' && '#eee' } } onClick={ () => { this.changeModel('backlog') } }>Backlog</Button> }
              { curKanban.type == 'scrum' && <Button style={ { backgroundColor: mode == 'issue' && '#eee' } } onClick={ () => { this.changeModel('issue') } }>活动Sprint</Button> }
              <Button style={ { backgroundColor: mode == 'config' && '#eee' } } onClick={ () => { this.changeModel('config') } }>配置</Button>
            </ButtonGroup> }
            { kanbans.length > 0 && 
            <DropdownButton pullRight title='列表' onSelect={ this.changeKanban.bind(this) }>
            { _.map(kanbans, (v, i) => ( 
              <MenuItem key={ i } eventKey={ v.id }>
                <div style={ { display: 'inline-block', width: '20px', textAlign: 'left' } }>
                  { curKanban.id === v.id && <i className='fa fa-check'></i> }
                </div>
                <span>{ v.name }</span>
              </MenuItem> ) ) }
            { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem divider/> }
            { options.permissions && options.permissions.indexOf('manage_project') !== -1 && 
              <MenuItem eventKey='create'>
                { kanbans.length > 0 && <div style={ { display: 'inline-block', width: '20px' } }/> }
                <span>创建看板</span>
              </MenuItem> }
            </DropdownButton> } 
          </div>
        </div>

        { mode === 'issue' && !loading && !_.isEmpty(curKanban) &&
        <div style={ { height: '45px', borderBottom: '2px solid #f5f5f5', display: this.state.hideHeader ? 'none': 'block' } }>
          { curKanban.type == 'scrum' && !_.isEmpty(activeSprint) &&
          <OverlayTrigger trigger='click' rootClose placement='bottom' overlay={ popoverSprint }>
            <div style={ { float: 'left', marginTop: '7px', marginRight: '20px', cursor: 'pointer' } }>
              Sprint { activeSprint.no || '' } <i className='fa fa-caret-down' aria-hidden='true'></i>
            </div> 
          </OverlayTrigger> }
          <span style={ { float: 'left', marginTop: '7px', marginRight: '10px' } }>
            过滤器：
          </span>
          <Nav bsStyle='pills' style={ { float: 'left', lineHeight: '1.0' } } activeKey={ selectedFilter } onSelect={ this.handleSelect.bind(this) }>
            <NavItem eventKey='all' href='#'>全部</NavItem>
            { _.map(curKanban.filters || [], (v, i) => (<NavItem key={ i } eventKey={ i } href='#'>{ v.name }</NavItem>) ) }
          </Nav>
          <span style={ { float: 'right' } } title='隐藏看板头'>
            <Button onClick={ this.hideHeader.bind(this) }><i className='fa fa-angle-double-up' aria-hidden='true'></i></Button>
          </span>
          { curKanban.type == 'scrum' && !_.isEmpty(activeSprint) &&
          <span style={ { float: 'right', marginRight: '10px' } } title='燃尽图'>
            <Button onClick={ () => { this.setState({ burndownModalShow: true }) } }><i className='fa fa-line-chart' aria-hidden='true'></i> 燃尽图</Button>
          </span> }
          <span style={ { float: 'right', marginRight: '10px' } } title='更多过滤'>
            <Button onClick={ () => { this.setState({ moreFilterModalShow: true }) } }><i className='fa fa-filter' aria-hidden='true'></i> 更多过滤{ !_.isEmpty(this.state.query) ? '...' : '' }</Button>
          </span>
        </div> }
        { mode === 'backlog' && !_.isEmpty(curKanban) &&
        <div style={ { height: '45px', borderBottom: '2px solid #f5f5f5', display: this.state.hideHeader ? 'none': 'block' } }>
          <div className='exchange-icon' style={ { float: 'left', marginTop: '7px' } } onClick={ this.changeFilterMode.bind(this) } title={ '切换至' + (this.state.backlogFilterMode == 'epic' ? '版本' : 'Epic') }><i className='fa fa-retweet'></i></div>
          <span style={ { float: 'left', marginTop: '7px', marginRight: '5px' } }>{ this.state.backlogFilterMode === 'epic' ? 'Epic' : '版本' }过滤：</span>
          { this.state.backlogFilterMode === 'epic' ?
          <div style={ { display: 'inline-block', float: 'left', width: '28%' } }>
            <Select
              simpleValue
              options={ epicOptions }
              value={ selectedFilter == 'all' ? null : selectedFilter }
              onChange={ (newValue) => { this.handleSelectEV(newValue) } }
              placeholder='选择Epic'/>
          </div>
          :
          <div style={ { display: 'inline-block', float: 'left', width: '28%' } }>
            <Select
              simpleValue
              options={ versionOptions }
              value={ selectedFilter == 'all' ? null : selectedFilter }
              onChange={ (newValue) => { this.handleSelectEV(newValue) } }
              placeholder='选择版本'/>
          </div> }
          <span style={ { float: 'right' } } title='隐藏看板头'>
            <Button onClick={ this.hideHeader.bind(this) }><i className='fa fa-angle-double-up' aria-hidden='true'></i></Button>
          </span>
          { options.permissions && options.permissions.indexOf('manage_project') !== -1 &&
          <div style={ { display: 'inline-block', float: 'right', marginRight: '10px' } }> 
            <Button bsStyle='primary' onClick={ createSprint }><i className='fa fa-plus' aria-hidden='true'></i> 创建Sprint</Button>
          </div> }
        </div> }

        { mode === 'history' && !_.isEmpty(curKanban) &&
        <div style={ { height: '45px', borderBottom: '2px solid #f5f5f5', display: this.state.hideHeader ? 'none': 'block' } }>
          <div className='exchange-icon' style={ { float: 'left', marginTop: '7px' } }>Sprint</div>
          <div style={ { display: 'inline-block', float: 'left', width: '28%' } }>
            <Select
              simpleValue
              clearable={ false }
              options={ completedSprintOptions }
              value={ selectedFilter == 'all' ? completedSprintNum : selectedFilter }
              onChange={ (newValue) => { this.handleSelectSprint(newValue) } }
              placeholder='选择Sprint'/>
          </div>
          { !_.isEmpty(selectedSprint) &&
          <OverlayTrigger trigger='click' rootClose placement='bottom' overlay={ hisPopoverSprint }>
            <div style={ { float: 'left', margin: '7px 10px', cursor: 'pointer' } }>
              <i className='fa fa-info-circle' aria-hidden='true'></i>
            </div>
          </OverlayTrigger> }
          <span style={ { float: 'right' } } title='隐藏看板头'>
            <Button onClick={ this.hideHeader.bind(this) }><i className='fa fa-angle-double-up' aria-hidden='true'></i></Button>
          </span>
          <span style={ { float: 'right', marginRight: '10px' } } title='燃尽图'>
            <Button onClick={ () => { this.setState({ hisBurndownModalShow: true }) } }><i className='fa fa-line-chart' aria-hidden='true'></i> 燃尽图</Button>
          </span>
        </div> }

        { mode === 'epic' && !_.isEmpty(curKanban) && options.permissions && options.permissions.indexOf('manage_project') !== -1 && 
        <div style={ { height: '45px', display: this.state.hideHeader ? 'none': 'block' } }>
          <div style={ { display: 'inline-block', float: 'left', marginRight: '10px' } }>
            <Button disabled={ indexEpicLoading } onClick={ () => { this.setState({ createEpicModalShow: true }) } }>
              <i className='fa fa-plus' aria-hidden='true'></i> 新建Epic
            </Button>
          </div>
          { !indexEpicLoading &&  
          <div style={ { display: 'inline-block', float: 'left', marginRight: '10px' } }>
            <Button onClick={ () => { this.setState({ sortCardsModalShow: true }) } }>
              <i className='fa fa-pencil' aria-hidden='true'></i> 编辑顺序
            </Button>
          </div> }
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
            addLabels={ addLabels }
            loading={ loading }
            project={ project }
            i18n={ i18n }/> }
        { this.state.createEpicModalShow &&
          <CreateEpicModal
            show
            close={ this.createEpicModalClose.bind(this) }
            create={ createEpic }
            collection={ epics }
            i18n={ i18n }/> }
        { this.state.sortCardsModalShow &&
          <SortCardsModal
            show
            mode='Epic'
            close={ this.sortCardsModalClose.bind(this) }
            cards={ epics }
            setSort={ setEpicSort }
            sortLoading={ epicLoading }
            i18n={ i18n }/> }
        { this.state.burndownModalShow &&
          <BurndownModal
            show
            getSprintLog={ getSprintLog }
            loading={ sprintLogLoading }
            data={ sprintLog }
            close={ this.burndownModalClose.bind(this) }
            no={ activeSprint.no }/> }
        { this.state.moreFilterModalShow &&
          <MoreFilterModal
            show
            search={ this.moreSearch.bind(this) }
            query={ this.state.query }
            options={ options }
            close={ this.moreFilterModalClose.bind(this) }/> }
        { this.state.hisBurndownModalShow &&
          <BurndownModal
            show
            getSprintLog={ getSprintLog }
            loading={ sprintLogLoading }
            data={ sprintLog }
            close={ this.hisBurndownModalClose.bind(this) }
            no={ selectedFilter }/> }
      </div>
    );
  }
}
