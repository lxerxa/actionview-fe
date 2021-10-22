import React, { PropTypes, Component } from 'react';
import { Button, Label, DropdownButton, MenuItem, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import _ from 'lodash';
import { IssueFilterList, parseQuery } from '../issue/IssueFilterList';

const CreateModal = require('../issue/CreateModal');
const SaveFilterModal = require('../issue/SaveFilterModal');
const ResetFiltersNotify = require('../issue/ResetFiltersNotify');
const FilterConfigModal = require('../share/FilterConfigModal');
const FilterDelModal = require('../issue/DelFiltersModal');

const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      createModalShow: false, 
      filterConfigShow: false, 
      filterDelShow: false,
      searchShow: false, 
      saveFilterShow: false,
      resetFiltersShow: false 
    };

    this.createModalClose = this.createModalClose.bind(this);
    this.saveFilterModalClose = this.saveFilterModalClose.bind(this);
    this.resetFiltersNotifyClose = this.resetFiltersNotifyClose.bind(this);
    this.filterConfigModalClose = this.filterConfigModalClose.bind(this);
    this.filterDelModalClose = this.filterDelModalClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    addLabels: PropTypes.func.isRequired,
    saveFilter: PropTypes.func.isRequired,
    resetFilters: PropTypes.func.isRequired,
    configFilters: PropTypes.func.isRequired,
    delFilters: PropTypes.func.isRequired,
    index: PropTypes.func,
    refresh: PropTypes.func,
    getOptions: PropTypes.func,
    query: PropTypes.object,
    project: PropTypes.object,
    options: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    optionsLoading: PropTypes.bool.isRequired,
    filterLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired
  }

  componentWillMount() {
    const { getOptions } = this.props;
    getOptions();
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  saveFilterModalClose() {
    this.setState({ saveFilterShow: false });
  }

  resetFiltersNotifyClose() {
    this.setState({ resetFiltersShow: false });
  }

  filterConfigModalClose() {
    this.setState({ filterConfigShow: false });
  }

  filterDelModalClose() {
    this.setState({ filterDelShow: false });
  }

  selectFilter(eventKey) {
    const { refresh, options={} } = this.props;

    if (eventKey == 'filterConfig') {
      this.setState({ filterConfigShow: true });
    } else if(eventKey == 'saveFilter') {
      this.setState({ saveFilterShow : true });
    } else if(eventKey == 'filterDel') {
      this.setState({ filterDelShow : true });
    } else {
      const filters = options.filters || [];
      const filter = _.find(filters, { id: eventKey }) || {};
      refresh(filter.query || {});
    }
  }

  operateSelect(eventKey) {
    const { refresh, index, query } = this.props;
    if (eventKey === 'refresh') {
      if (query.page > 1) {
        refresh(_.extend(query, { page: undefined }));
      } else {
        index(query);
      }
    } else if (eventKey === 'gotolist') {
      refresh(_.extend(query, { page: undefined }), 'issuelist');
    }
  }

  render() {
    const { 
      i18n, 
      user,
      index,
      create, 
      addLabels, 
      saveFilter, 
      resetFilters, 
      configFilters, 
      delFilters, 
      indexLoading, 
      optionsLoading, 
      filterLoading, 
      options={}, 
      refresh, 
      query, 
      loading, 
      project 
    } = this.props;

    const standardTypes = _.reject(_.reject(options.types || [], { type: 'subtask' }) || [], { disabled: true }) || [];
    const sqlTxt = optionsLoading ? '' : parseQuery(query, options);

    return (
      <div>
        <div style={ { paddingTop: '5px' } }>
          <DropdownButton className='create-btn' id='filters' title='过滤器' onSelect={ this.selectFilter.bind(this) }>
            { options.filters && options.filters.length > 0 ? 
              _.map(options.filters || [], (val) => <MenuItem eventKey={ val.id } key={ val.id }>{ val.name }</MenuItem> ) :
              <MenuItem disabled>无</MenuItem> }
            <MenuItem divider/>
            <MenuItem eventKey='saveFilter'>保存当前检索</MenuItem>
            <MenuItem eventKey='filterConfig'>过滤器排序</MenuItem>
            <MenuItem eventKey='filterDel'>过滤器删除</MenuItem>
          </DropdownButton>
          <Button className='create-btn' disabled={ optionsLoading } onClick={ () => { this.setState({ searchShow: !this.state.searchShow }); } }>检索&nbsp;<i className={ this.state.searchShow ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down' }></i></Button>
          { options.permissions && options.permissions.indexOf('create_issue') !== -1 &&
          <Button className='create-btn' bsStyle='primary' disabled={ standardTypes.length <= 0 || optionsLoading } onClick={ () => { this.setState({ createModalShow: true }); } }><i className='fa fa-plus'></i> 创建</Button> }
          <div style={ { marginTop: '10px', float: 'right' } }>
            <DropdownButton id='more' pullRight style={ { float: 'right' } } title='更多' onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='refresh'>刷新</MenuItem>
              <MenuItem divider/>
              <MenuItem eventKey='gotolist'>跳至问题列表</MenuItem>
            </DropdownButton>
          </div>
          { sqlTxt &&
          <div className='cond-bar'>
            <div className='cond-contents' title={ sqlTxt }><b>检索条件</b>：{ sqlTxt }</div>
            <div className='remove-icon' onClick={ () => { refresh({}); } } title='清空当前检索'><i className='fa fa-undo'></i></div>
            <div className='remove-icon' onClick={ () => { this.setState({ saveFilterShow: true }); } } title='保存当前检索'><i className='fa fa-save'></i></div>
          </div> }
        </div>
        { this.state.filterConfigShow && 
          <FilterConfigModal 
            show 
            isRemovable={ false }
            close={ this.filterConfigModalClose } 
            loading={ filterLoading } 
            config={ configFilters } 
            filters={ options.filters || [] } 
            i18n={ i18n }/> }
        { this.state.filterDelShow &&
          <FilterDelModal
            show
            close={ this.filterDelModalClose }
            loading={ filterLoading }
            del={ delFilters }
            data={ _.filter(options.filters || [], (v) => v.creator == user.id) }
            i18n={ i18n }/> }
        <IssueFilterList 
          values={ query } 
          visable={ this.state.searchShow } 
          indexLoading={ indexLoading } 
          options={ options } 
          onChange={ (newValue) => { refresh(_.assign({}, newValue, { page: undefined })) } } />
        { this.state.createModalShow && 
          <CreateModal 
            show 
            close={ this.createModalClose } 
            options={ options } 
            create={ create } 
            addLabels={ addLabels } 
            loading={ loading } 
            project={ project } 
            i18n={ i18n }/> }
        { this.state.saveFilterShow && 
          <SaveFilterModal 
            show 
            close={ this.saveFilterModalClose } 
            filters={ options.filters || [] } 
            create={ saveFilter } 
            query={ query } 
            loading={ filterLoading } 
            sqlTxt={ sqlTxt } 
            options={ options }
            i18n={ i18n }/> }
        { this.state.resetFiltersShow &&
          <ResetFiltersNotify
            show
            close={ this.resetFiltersNotifyClose }
            reset={ resetFilters }
            loading={ filterLoading }
            i18n={ i18n }/> }
      </div>
    );
  }
}
