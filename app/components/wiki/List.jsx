import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Panel, FormGroup, FormControl, ButtonGroup, Button, Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';
import Select from 'react-select';
import DropzoneComponent from 'react-dropzone-component';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const $ = require('$');
const moment = require('moment');
const DelNotify = require('./DelNotify');
const CheckoutNotify = require('./CheckoutNotify');
const CopyModal = require('./CopyModal');
const MoveModal = require('./MoveModal');
const EditModal = require('./EditModal');
const EditRow = require('./EditRow');
const img = require('../../assets/images/loading.gif');
const SimpleMDE = require('SimpleMDE');

let simplemde = {};

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      copyModalShow: false,
      moveModalShow: false,
      checkoutNotifyShow: false, 
      delNotifyShow: false, 
      operateShow: false, 
      hoverRowId: '', 
      editRowId: '',
      createFolderShow: false,
      searchShow: false,
      name: '' 
    };

    this.state.sortkey = window.localStorage && window.localStorage.getItem('wiki-sortkey') || 'create_time_desc';

    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.checkoutNotifyClose = this.checkoutNotifyClose.bind(this);
    this.reload = this.reload.bind(this);
    this.cancelEditRow = this.cancelEditRow.bind(this);
    this.initEditRow = this.initEditRow.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    project_key: PropTypes.string.isRequired,
    directory: PropTypes.string.isRequired,
    options: PropTypes.object,
    user: PropTypes.object.isRequired,
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    sort: PropTypes.func.isRequired,
    goto: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    copy: PropTypes.func.isRequired,
    move: PropTypes.func.isRequired,
    checkout: PropTypes.func.isRequired,
    checkin: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    directoryShow: PropTypes.bool.isRequired,
    toggleDirectory: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index, query={} } = this.props;
    const newQuery = {};
    if (query.name) {
      newQuery.name = this.state.name = query.name;
    }
    if (query.updated_at) {
      newQuery.updated_at = this.state.updated_at = query.updated_at;
    }
    index(newQuery);
  }

  cancelEditRow() {
    this.setState({ 
      editRowId: '',
      createFolderShow: false });
  }

  initEditRow() {
    this.state.editRowId = '';
    this.state.createFolderShow = false;
  }

  delNotifyClose() {
    this.setState({ delNotifyShow: false });
  }

  checkoutNotifyClose() {
    this.setState({ checkoutNotifyShow: false });
  }

  componentDidMount() {
    const self = this;
    $('#pname').bind('keypress',function(event){  
      if(event.keyCode == '13') {  
        self.reload();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const newQuery = nextProps.query || {};
    const { directory, index, query } = this.props;
    if (!_.isEqual(newQuery, query) || !_.isEqual(directory, nextProps.directory)) {
      index(newQuery);
      this.initEditRow();
    }

    this.state.name = newQuery.name || '';
    this.state.updated_at = newQuery.updated_at || null;
  }

  delNotify(id) {
    this.setState({ delNotifyShow: true });
    const { select } = this.props;
    select(id);
  }

  async operateSelect(eventKey) {
    const { hoverRowId } = this.state;
    const { select, project_key, checkin, checkout, user, goto } = this.props;
    await select(hoverRowId);

    if (eventKey === 'checkin') {
      const ecode = await checkin(hoverRowId);
      if (ecode !== 0) {
        notify.show('文档加锁失败。', 'error', 2000);
      } else {
        notify.show('已加锁。', 'success', 2000);
      }
    } else if (eventKey === 'checkout') {
      const { selectedItem } = this.props;
      if (selectedItem.checkin && selectedItem.checkin.user.id !== user.id) {
        this.setState({ checkoutNotifyShow: true });
      } else {
        const ecode = await checkout(hoverRowId);
        if (ecode !== 0) {
          notify.show('文档解锁失败。', 'error', 2000);
        } else {
          notify.show('已解锁。', 'success', 2000);
        }
      }
    } else if (eventKey === 'edit') {
      goto('edit', hoverRowId);
    } else if (eventKey === 'copy') {
      this.setState({ copyModalShow: true });
    } else if (eventKey === 'move') {
      this.setState({ moveModalShow: true });
    } else if (eventKey === 'del') {
      this.setState({ delNotifyShow: true });
    } else if (eventKey === 'rename') {
      this.setState({ editRowId: hoverRowId });
    }
  }

  onRowMouseOver(rowData) {
    if (rowData.id !== this.state.hoverRowId) {
      this.setState({ operateShow: true, hoverRowId: rowData.id });
    }
  }

  onMouseLeave() {
    this.setState({ operateShow: false, hoverRowId: '' });
  }

  reload() {
    const { reload } = this.props;
    const query = {};
    if (this.state.updated_at) {
      query.updated_at = this.state.updated_at;
    }
    if (_.trim(this.state.name)) {
      query.name = _.trim(this.state.name);
    }
    reload(query);
  }

  updatedAtChange(newValue) {
    this.state.updated_at = newValue;
    this.reload();
  }

  sortChange(newValue) {
    if (window.localStorage) {
      window.localStorage.setItem('wiki-sortkey', newValue);
    }
    this.setState({ sortkey: newValue });
    const { sort } = this.props;
    sort(newValue);
  }

  render() {
    const { 
      i18n, 
      project_key,
      directory,
      collection, 
      selectedItem, 
      loading, 
      indexLoading, 
      itemLoading, 
      reload, 
      checkin,
      checkout,
      goto,
      create, 
      del, 
      update, 
      copy, 
      move, 
      options, 
      user, 
      query,
      directoryShow,
      toggleDirectory
    } = this.props;

    const { 
      createFolderShow, 
      searchShow,
      editRowId, 
      hoverRowId, 
      operateShow 
    } = this.state;

    const updatedat_options = [
      { value: '1w', label: '1周内' },
      { value: '2w', label: '2周内' },
      { value: '1m', label: '1个月内' },
      { value: '2m', label: '2个月内' }
    ];

    const sortOptions = [
      { value: 'create_time_asc', label: '创建时间 ↑' },
      { value: 'create_time_desc', label: '创建时间 ↓' },
      { value: 'update_time_asc', label: '更新时间 ↑' },
      { value: 'update_time_desc', label: '更新时间 ↓' },
      { value: 'name_asc', label: '名称 ↑' },
      { value: 'name_desc', label: '名称 ↓' }
    ];

    let contents = '';
    let homeHeader = '';
    const filepreviewDOM = document.getElementById('homepreview');
    if (filepreviewDOM && options.home && options.home.contents) {
      simplemde = new SimpleMDE({ element: filepreviewDOM, autoDownloadFontAwesome: false });
      contents = simplemde.markdown(_.escape(options.home.contents));
      homeHeader = (
        <span style={ { fontWeight: 400, fontSize: '14px' } }>
          <i className='fa fa-file-text-o'></i>
          <span style={ { marginLeft: '8px' } }><Link to={ '/project/' + project_key + '/wiki/root/' + options.home.id }>{ options.home.name }</Link></span>
          <span style={ { float: 'right', fontWeight: 400, fontSize: '14px' } }>最近修改：{ options.home.editor && options.home.editor.name ? options.home.editor.name : (options.home.creator && options.home.creator.name || '') }于 { options.home.updated_at ? moment.unix(options.home.updated_at).format('YYYY/MM/DD HH:mm') : moment.unix(options.home.created_at).format('YYYY/MM/DD HH:mm') }</span>
        </span>);
    }

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const rows = [];
    if (!indexLoading && options.path && options.path.length > 1 && _.isEmpty(query)) {
      const parent = options.path[options.path.length - 2];
      rows.push({ 
        id: parent.id,
        name: (
          <div>
            <span style={ { marginRight: '5px', color: '#FFD300' } }><i className='fa fa-arrow-up'></i></span>
            <Link to={ '/project/' + project_key + '/wiki' + (parent.id !== '0' ? ( '/' + parent.id ) : '') }>返回上级</Link>
          </div> ),
        operation: (<div/>)
      });
    }

    if (createFolderShow) {
      rows.push({
        id: 'createFolder',
        name: 
          <EditRow 
            i18n={ i18n }
            loading={ loading }
            data={ {} } 
            create={ create }
            collection={ collection } 
            cancel={ this.cancelEditRow }/>, 
        operation: (<div/>)
      });
    }

    const directories = _.filter(collection, { d: 1 });
    _.map(directories, (v, i) => {
      if (editRowId == v.id) {
        rows.push({
          id: v.id,
          name: 
            <EditRow 
              i18n={ i18n }
              loading={ loading }
              data={ selectedItem } 
              collection={ collection } 
              edit={ update }
              cancel={ this.cancelEditRow }/>, 
          operation: (<div/>)
        });
        return;
      }
      rows.push({
        id: v.id,
        name: (
          <div>
            <span style={ { marginRight: '5px', color: '#FFD300' } }><i className='fa fa-folder'></i></span>
            <Link to={ '/project/' + project_key + '/wiki/' + v.id }>{ v.name }</Link>
          </div> ),
        operation: (
          <div>
          { operateShow && hoverRowId === v.id && !itemLoading && options.permissions && options.permissions.indexOf('manage_project') !== -1 &&
            <DropdownButton
              pullRight
              bsStyle='link'
              style={ { textDecoration: 'blink' ,color: '#000' } }
              key={ i }
              title={ node }
              id={ `dropdown-basic-${i}` }
              onClick={ this.cancelEditRow }
              onSelect={ this.operateSelect.bind(this) }>
              { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='rename'>重命名</MenuItem> } 
              { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='move'>移动</MenuItem> } 
              { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='del'>删除</MenuItem> }
            </DropdownButton> }
            <img src={ img } className={ (itemLoading && selectedItem.id === v.id) ? 'loading' : 'hide' }/>
          </div>)
      });      
    });

    const files = _.reject(collection, { d: 1 });
    const fileNum = files.length;
    for (let i = 0; i < fileNum; i++) {
      rows.push({
        id: files[i].id,
        name: ( 
          <div> 
            <span style={ { marginRight: '5px', color: '#777', float: 'left' } }><i className='fa fa-file-text-o'></i></span>
            <Link to={ '/project/' + project_key + '/wiki/' + (files[i].parent == '0' ? 'root' : files[i].parent)  + '/' + files[i].id }>
              { files[i].name }
            </Link>
            { !_.isEmpty(files[i].attachments) &&
            <span style={ { marginLeft: '8px' } } title={ files[i].attachments.length + '个附件' }>
              <i className='fa fa-paperclip'></i>
            </span> } 
            { !_.isEmpty(files[i].checkin) &&
            <span style={ { marginLeft: '8px', color: '#f0ad4e' } } title={ '该文档被' + ( files[i].checkin.user ? (files[i].checkin.user.id == user.id ? '我' : (files[i].checkin.user.name || '')) : '' ) + '于 ' + ( files[i].checkin.at ? moment.unix(files[i].checkin.at).format('YYYY/MM/DD HH:mm') : '' ) + ' 锁定。' }><i className='fa fa-lock'></i></span> }
            <span style={ { float: 'right' } }>
              { files[i].parent != directory && 
              <Link to={ '/project/' + project_key + '/wiki' + (files[i].parent == '0' ? '' : ('/' + files[i].parent) ) }><span style={ { marginRight: '15px', float: 'left' } }>打开目录</span></Link> }
              { files[i].creator &&
              <span style={ { marginRight: '15px', float: 'left' } }>
                { files[i].creator.name + '  ' + moment.unix(files[i].created_at).format('YYYY/MM/DD HH:mm') }
              </span> }
            </span>
          </div> ),
        operation: (
          <div>
          { operateShow 
            && hoverRowId === files[i].id 
            && !itemLoading 
            && (!(!_.isEmpty(files[i].checkin) && files[i].checkin.user.id !== user.id) || options.permissions && options.permissions.indexOf('manage_project') !== -1) &&
            <DropdownButton 
              pullRight 
              bsStyle='link' 
              style={ { textDecoration: 'blink' ,color: '#000' } } 
              key={ i } 
              title={ node } 
              id={ `dropdown-basic-${i}` } 
              onClick={ this.cancelEditRow }
              onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='edit'>编辑</MenuItem>
              { _.isEmpty(files[i].checkin) && <MenuItem eventKey='checkin'>加锁</MenuItem> }
              { !_.isEmpty(files[i].checkin) && (files[i].checkin.user.id == user.id || (options.permissions && options.permissions.indexOf('manage_project') !== -1)) && <MenuItem eventKey='checkout'>解锁</MenuItem> }
              <MenuItem eventKey='copy'>复制</MenuItem>
              <MenuItem eventKey='move'>移动</MenuItem>
              <MenuItem eventKey='del'>删除</MenuItem>
            </DropdownButton> }
            <img src={ img } className={ (itemLoading && selectedItem.id === files[i].id) ? 'loading' : 'hide' }/>
          </div>
        )
      });
    }

    const opts = {};
    if (indexLoading) {
      opts.noDataText = ( <div><img src={ img } className='loading'/></div> );
    } else {
      opts.noDataText = '暂无数据显示。'; 
    } 

    opts.onRowMouseOver = this.onRowMouseOver.bind(this);
    // opts.onMouseLeave = this.onMouseLeave.bind(this);

    return (
      <div>
        <div style={ { marginTop: '5px', height: '40px' } }>
          <FormGroup>
            <span style={ { float: 'left' } } className='directory-indent' onClick={ () => { toggleDirectory(); } }><i className={ directoryShow ? 'fa fa-outdent' : 'fa fa-indent' }></i></span>
            <span style={ { float: 'left' } }>
              <Breadcrumb style={ { marginBottom: '0px', backgroundColor: '#fff', paddingLeft: '5px', marginTop: '0px' } }>
                { _.map(options.path || [], (v, i) => {
                  if (i === options.path.length - 1) {
                    return (<Breadcrumb.Item active key={ i }>{ i === 0 ? '根目录' : v.name }</Breadcrumb.Item>);
                  } else if (i === 0) {
                    return (<Breadcrumb.Item key={ i } disabled={ indexLoading }><Link to={ '/project/' + project_key + '/wiki' }>根目录</Link></Breadcrumb.Item>);
                  } else {
                    return (<Breadcrumb.Item key={ i } disabled={ indexLoading }><Link to={ '/project/' + project_key + '/wiki/' + v.id }>{ v.name }</Link></Breadcrumb.Item>);
                  }
                }) }
              </Breadcrumb>
            </span>
            <span style={ { float: 'right' } }>
              <span style={ { float: 'right' } }>
                <DropdownButton
                  pullRight
                  title='排序'
                  id='basic-nav-dropdown-project'
                  onSelect={ this.sortChange.bind(this) }>
                    { _.map(sortOptions, (v, i) =>
                      <MenuItem key={ i } eventKey={ v.value }>
                        <div style={ { display: 'inline-block', width: '20px', textAlign: 'left' } }>
                        { this.state.sortkey == v.value && <span><i className='fa fa-check'></i></span> }
                        </div>
                        <span>{ v.label }</span>
                      </MenuItem> ) }
                </DropdownButton>
              </span>
              <span style={ { float: 'right', marginRight: '10px' } }>
                <Button onClick={ ()=>{ this.setState({ searchShow: !this.state.searchShow }) } }><i className='fa fa-search'></i> 检索{ !_.isEmpty(query) && !searchShow ? '...' : '' }</Button>
              </span>
              <ButtonGroup style={ { float: 'right', marginRight: '10px' } }>
                <Button onClick={ () => { goto('new'); } } style={ { height: '36px' } } disabled={ indexLoading || itemLoading || loading || !_.isEmpty(query) }>
                  <i className='fa fa-pencil'></i>&nbsp;新建文档
                </Button>
                { options.permissions && options.permissions.indexOf('manage_project') !== -1 &&
                <Button onClick={ () => { this.cancelEditRow(); this.setState({ createFolderShow: true }); } } style={ { height: '36px' } } disabled={ indexLoading || itemLoading || loading || !_.isEmpty(query) }>
                  <i className='fa fa-plus'></i>&nbsp;创建目录
                </Button> }
              </ButtonGroup>
            </span>
          </FormGroup>
          { searchShow &&
          <FormGroup style={ { clear: 'both' } }>
            <span style={ { float: 'right', marginTop: '5px', backgroundColor: '#f1f1f1', padding: '10px', borderRadius: '4px' } }>
              <span style={ { float: 'right', width: '165px' } }>
                <FormControl
                  type='text'
                  id='pname'
                  style={ { height: '36px' } }
                  value={ this.state.name }
                  onChange={ (e) => { this.setState({ name: e.target.value }) } }
                  placeholder='标题名称查询...' />
              </span>
              <span style={ { float: 'right', width: '110px', marginRight: '10px' } }>
                <Select
                  simpleValue
                  placeholder='更新时间'
                  value={ this.state.updated_at }
                  onChange={ this.updatedAtChange.bind(this) }
                  options={ updatedat_options }/>
              </span>
            </span>
          </FormGroup> }
        </div>
        <div>
          <BootstrapTable data={ rows } bordered={ false } hover options={ opts } trClassName='tr-middle'>
            <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name'>名称</TableHeaderColumn>
            <TableHeaderColumn width='60' dataField='operation'/>
          </BootstrapTable>
          { !indexLoading && directory === '0' && _.isEmpty(query) && (!options.home || !options.home.id) && options.permissions && options.permissions.indexOf('manage_project') !== -1 &&
          <div className='info-col'>
            <div className='info-icon'><i className='fa fa-info-circle'></i></div>
            <div className='info-content'>
              <span>为了项目成员能更好的理解此项目，建议增加 <a href='#' onClick={ (e) => { e.preventDefault(); goto('new', '', { home: 1 }); } }>Home</a> 页面。</span>
            </div>
          </div> }
          { !indexLoading && options.home && options.home.id && _.isEmpty(query) &&
          <Panel header={ homeHeader } style={ { marginTop: '10px' } }>
            <div id='homewiki-contents' dangerouslySetInnerHTML= { { __html: contents } } />
          </Panel> }
          <div style={ { marginBottom: '40px' } }>
            <div style={ { display: 'none' } }>
              <textarea name='field' id='homepreview'></textarea>
            </div>
          </div>
          { this.state.delNotifyShow &&
            <DelNotify
              show
              close={ this.delNotifyClose }
              data={ selectedItem }
              del={ del }/> }
          { this.state.checkoutNotifyShow &&
            <CheckoutNotify
              show
              close={ this.checkoutNotifyClose }
              data={ selectedItem }
              checkout={ checkout }/> }
          { this.state.copyModalShow &&
            <CopyModal
              show
              project_key={ project_key }
              close={ () => { this.setState({ copyModalShow: false }); } }
              copy={ copy }
              data={ selectedItem }
              curPath={ directory }
              i18n={ i18n }/> }
          { this.state.moveModalShow &&
            <MoveModal
              show
              project_key={ project_key }
              close={ () => { this.setState({ moveModalShow: false }); } }
              move={ move }
              data={ selectedItem }
              i18n={ i18n }/> }
        </div>
      </div>
    );
  }
}
