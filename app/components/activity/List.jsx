import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, DropdownButton, MenuItem, ButtonGroup, Nav, NavItem } from 'react-bootstrap';
import Person from '../share/Person';
import _ from 'lodash';

const moment = require('moment');
const no_avatar = require('../../assets/images/no_avatar.png');
const img = require('../../assets/images/loading.gif');
const DetailBar = require('../issue/DetailBar');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { limit: 30, category: 'all', barShow: false, hoverRowId: '' };
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    collection: PropTypes.array.isRequired,
    increaseCollection: PropTypes.array.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    moreLoading: PropTypes.bool.isRequired,
    more: PropTypes.func.isRequired,
    wfCollection: PropTypes.array.isRequired,
    wfLoading: PropTypes.bool.isRequired,
    viewWorkflow: PropTypes.func.isRequired,
    indexComments: PropTypes.func.isRequired,
    addComments: PropTypes.func.isRequired,
    editComments: PropTypes.func.isRequired,
    delComments: PropTypes.func.isRequired,
    commentsCollection: PropTypes.array.isRequired,
    commentsIndexLoading: PropTypes.bool.isRequired,
    commentsLoading: PropTypes.bool.isRequired,
    commentsItemLoading: PropTypes.bool.isRequired,
    commentsLoaded: PropTypes.bool.isRequired,
    indexWorklog: PropTypes.func.isRequired,
    addWorklog: PropTypes.func.isRequired,
    editWorklog: PropTypes.func.isRequired,
    delWorklog: PropTypes.func.isRequired,
    worklogCollection: PropTypes.array.isRequired,
    worklogIndexLoading: PropTypes.bool.isRequired,
    worklogLoading: PropTypes.bool.isRequired,
    worklogLoaded: PropTypes.bool.isRequired,
    indexHistory: PropTypes.func.isRequired,
    historyCollection: PropTypes.array.isRequired,
    historyIndexLoading: PropTypes.bool.isRequired,
    historyLoaded: PropTypes.bool.isRequired,
    itemData: PropTypes.object.isRequired,
    project: PropTypes.object,
    options: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    show: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    copy: PropTypes.func.isRequired,
    move: PropTypes.func.isRequired,
    convert: PropTypes.func.isRequired,
    resetState: PropTypes.func.isRequired,
    setAssignee: PropTypes.func.isRequired,
    fileLoading: PropTypes.bool.isRequired,
    delFile: PropTypes.func.isRequired,
    addFile: PropTypes.func.isRequired,
    record: PropTypes.func.isRequired,
    forward: PropTypes.func.isRequired,
    cleanRecord: PropTypes.func.isRequired,
    visitedIndex: PropTypes.number.isRequired,
    visitedCollection: PropTypes.array.isRequired,
    createLink: PropTypes.func.isRequired,
    delLink: PropTypes.func.isRequired,
    linkLoading: PropTypes.bool.isRequired,
    doAction: PropTypes.func.isRequired,
    watch: PropTypes.func.isRequired,
    user: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index({ limit: this.state.limit });
  }

  refresh() {
    const { index } = this.props;
    index({ category: this.state.category, limit: this.state.limit });
  }

  more() {
    const { more, collection } = this.props;
    more({ category: this.state.category, offset_id: collection[collection.length - 1].id, limit: this.state.limit });
  }

  handleSelect(selectedKey) {
    this.setState({ category: selectedKey });

    const { index } = this.props;
    index({ category: selectedKey, limit: this.state.limit });
  }

  closeDetail() {
    this.setState({ barShow: false });
    const { cleanRecord } = this.props;
    cleanRecord();
  }

  async issueView(id) {
    this.setState({ barShow: true });
    const { show, record } = this.props;
    const ecode = await show(id);
    if (ecode === 0) {
      record();
    }
  }

  render() {
    const { 
      i18n,
      collection, 
      increaseCollection, 
      indexLoading, 
      moreLoading, 
      wfCollection,
      wfLoading,
      viewWorkflow,
      indexComments,
      addComments,
      editComments,
      delComments,
      commentsCollection,
      commentsIndexLoading,
      commentsLoading,
      commentsItemLoading,
      commentsLoaded,
      indexWorklog,
      addWorklog,
      editWorklog,
      delWorklog,
      worklogCollection,
      worklogIndexLoading,
      worklogLoading,
      worklogLoaded,
      indexHistory,
      historyCollection,
      historyIndexLoading,
      historyLoaded,
      itemData,
      project,
      options,
      loading,
      itemLoading,
      show,
      edit,
      create,
      setAssignee,
      fileLoading,
      delFile,
      addFile,
      record,
      forward,
      cleanRecord,
      visitedIndex,
      visitedCollection,
      createLink,
      delLink,
      linkLoading,
      watch,
      copy,
      move,
      convert,
      resetState,
      del,
      doAction,
      user
    } = this.props;

    const { hoverRowId } = this.state;

    const timeAgos = [ { key : 'just', name : '刚刚' },
                       { key : '15m', name : '15分钟前' },
                       { key : '30m', name : '30分钟前' },
                       { key : '1h', name : '1小时前' },
                       { key : '3h', name : '3小时前' },
                       { key : '5h', name : '5小时前' },
                       { key : '7h', name : '7小时前' },
                       { key : '9h', name : '9小时前' },
                       { key : '1d', name : '1天前' },
                       { key : '2d', name : '2天前' },
                       { key : '3d', name : '3天前' },
                       { key : '4d', name : '4天前' },
                       { key : '5d', name : '5天前' },
                       { key : '6d', name : '6天前' },
                       { key : '1w', name : '1周前' },
                       { key : '2w', name : '2周前' },
                       { key : '3w', name : '3周前' },
                       { key : '4w', name : '4周前' },
                       { key : '1m', name : '1月前' },
                       { key : '3m', name : '3月前' },
                       { key : '5m', name : '5月前' },
                       { key : '7m', name : '7月前' },
                       { key : '9m', name : '9月前' },
                       { key : '11m', name : '11月前' },
                       { key : '1y', name : '1年前' },
                       { key : '2y', name : '2年前' } ];

    const ltStyles = { textDecoration: 'line-through', marginRight: '5px', overflow: 'hidden', textOverflow: 'ellipsis' };

    const activities = [];
    const activityNum = collection.length;
    for (let i = 0; i < activityNum; i++) {

      const user = <Person data={ collection[i].user } />;

      const wfEventFlag =
         collection[i].event_key === 'close_issue' 
         || collection[i].event_key === 'resolve_issue' 
         || collection[i].event_key === 'reset_issue' 
         || collection[i].event_key === 'start_progress_issue' 
         || collection[i].event_key === 'stop_progress_issue' 
         || collection[i].event_key === 'reopen_issue' 
         || collection[i].event_key.indexOf('_') === -1;

      let comments = '';
      if (collection[i].event_key == 'add_comments' || collection[i].event_key == 'edit_comments' || collection[i].event_key == 'del_comments') {
        comments = collection[i].data.contents || '-';
        _.map(collection[i].data.atWho || [], (v) => {
          comments = comments.replace(eval('/@' + v.name + '/'), '<a title="' + v.name + '(' + v.email + ')' + '">@' + v.name + '</a>');
        });
        comments = comments.replace(/(\r\n)|(\n)/g, '<br/>');
      } 

      let agoName = '';
      let agoIndex = _.findIndex(timeAgos, { key: collection[i].ago_key });
      if (agoIndex !== -1) {
        agoName = timeAgos[agoIndex].name;
      }

      activities.push({
        id: collection[i].id,
        avatar: ( <img src={ collection[i].user.avatar ? '/api/getavatar?fid=' + collection[i].user.avatar : no_avatar } className='no-avatar'/> ),
        summary: (
          <div>
            <span style={ { marginRight: '5px' } }><b>{ collection[i].user.name }</b></span>

            { collection[i].event_key == 'create_link'     && <span>创建了问题链接</span> }
            { collection[i].event_key == 'del_link'        && <span>删除了问题链接</span> }
            { collection[i].issue_link &&
              <ul className='list-unstyled clearfix' style={ { marginTop: '10px', marginBottom: '5px', fontSize: '12px' } }>
                <li>
                  { collection[i].issue_link && collection[i].issue_link.src && 
                    (collection[i].issue_link.src.del_flg === 1 ? 
                      <span style={ ltStyles }>
                        { collection[i].issue_link.src.no + ' - ' + collection[i].issue_link.src.title }
                      </span> 
                      : 
                      <a style={ collection[i].issue_link.src.state == 'Closed' ? { textDecoration: 'line-through' } : {} } href='#' onClick={ (e) => { e.preventDefault(); this.issueView(collection[i].issue_link.src.id); } }>
                        <span style={ { marginRight: '5px' } }>
                          { collection[i].issue_link.src.no + ' - ' + collection[i].issue_link.src.title }
                        </span>
                      </a>) }
                </li>
                <li>{ collection[i].issue_link && collection[i].issue_link.relation || '' }</li>
                <li>
                  { collection[i].issue_link && collection[i].issue_link.dest && 
                    (collection[i].issue_link.dest.del_flg === 1 ? 
                      <span style={ ltStyles }>
                        { collection[i].issue_link.dest.no + ' - ' + collection[i].issue_link.dest.title }
                      </span> 
                      : 
                      <a style={ collection[i].issue_link.dest.state == 'Closed' ? { textDecoration: 'line-through' } : {} } href='#' onClick={ (e) => { e.preventDefault(); this.issueView(collection[i].issue_link.dest.id); } }>
                        <span style={ { marginRight: '5px' } }>
                          { collection[i].issue_link.dest.no + ' - ' + collection[i].issue_link.dest.title }
                        </span>
                      </a>) }
                </li>
              </ul> }

            { collection[i].event_key == 'create_issue'    && <span>创建了</span> }
            { collection[i].event_key == 'edit_issue'      && <span>更新了</span> }
            { collection[i].event_key == 'del_issue'       && <span>删除了</span> }
            { collection[i].event_key == 'assign_issue'    && <span>分配了</span> }
            { collection[i].event_key == 'reset_issue'     && <span>重置了</span> }
            { collection[i].event_key == 'move_issue'      && <span>移动了</span> }
            { collection[i].event_key == 'start_progress_issue'   && <span>开始解决</span> }
            { collection[i].event_key == 'stop_progress_issue'    && <span>停止解决</span> }
            { collection[i].event_key == 'resolve_issue'   && <span>解决了</span> }
            { collection[i].event_key == 'close_issue'     && <span>关闭了</span> }
            { collection[i].event_key == 'reopen_issue'    && <span>重新打开</span> }
            { collection[i].event_key == 'watched_issue'   && <span>关注了</span> }
            { collection[i].event_key == 'unwatched_issue' && <span>取消关注了</span> }
            { collection[i].event_key.indexOf('_') === -1  && <span>将</span> }
            { collection[i].issue && <span style={ { marginRight: '5px' } }>问题</span> }
            { collection[i].issue && (collection[i].issue.del_flg === 1 ? <span style={ ltStyles }>{ collection[i].issue.no + ' - ' + collection[i].issue.title }</span> : <a href='#' style={ collection[i].issue.state == 'Closed' ? { textDecoration: 'line-through' } : {} } onClick={ (e) => { e.preventDefault(); this.issueView(collection[i].issue.id); } }><span style={ { marginRight: '5px' } }>{ collection[i].issue.no + ' - ' + collection[i].issue.title }</span></a>) }
            { wfEventFlag && collection[i].event_key.indexOf('_') !== -1 && <span>, </span> }
            { wfEventFlag && collection[i].event_key.indexOf('_') === -1 && <span>的</span> }
            { wfEventFlag &&
            <span>
            { _.map(collection[i].data, (v, i) => {
              if ( i === 0) {
                return (<span>{ v.field + ' 更新为: ' + v.after_value }</span>);
              } else {
                return (<span>{ ', ' + v.field + ' 更新为: ' + v.after_value }</span>);
              }
            }) }
            </span> }
            { collection[i].event_key == 'edit_issue' && <span>的 { collection[i].data.length } 个字段</span> }
            { collection[i].event_key == 'edit_issue' &&
            <ul className='list-unstyled clearfix' style={ { marginTop: '10px', marginBottom: '5px', fontSize: '12px' } }>
            { _.map(collection[i].data, (v) => {
              return (<li dangerouslySetInnerHTML={ { __html: v.field + ': ' + v.after_value.replace(/(\r\n)|(\n)/g, '<br/>') } }/>);
            }) }
            </ul> }
            { collection[i].event_key == 'assign_issue'    && <span>给 { collection[i].data.new_user && collection[i].data.new_user.name || '' }</span> }

            { collection[i].event_key == 'add_file' && <span>上传了文档 { collection[i].data }</span> }
            { collection[i].event_key == 'del_file' && <span>删除了文档 <span style={ ltStyles }>{ collection[i].data }</span></span> }

            { collection[i].event_key == 'add_comments'   && <span>添加了备注</span> }
            { collection[i].event_key == 'edit_comments'  && <span>编辑了备注</span> }
            { collection[i].event_key == 'del_comments'   && <span>删除了备注</span> }
            { comments &&
            <ul className='list-unstyled clearfix' style={ { marginTop: '10px', marginBottom: '5px', fontSize: '12px' } }>
              <li style={ collection[i].event_key == 'del_comments' ? ltStyles : { overflow: 'hidden', textOverflow: 'ellipsis' } } dangerouslySetInnerHTML={ { __html: comments } }/>
            </ul> }

            { collection[i].event_key == 'add_worklog'    && <span> 添加了工作日志</span> }
            { collection[i].event_key == 'edit_worklog'   && <span> 编辑了工作日志</span> }
            { collection[i].event_key == 'del_worklog'    && <span> 删除了工作日志</span> }
            { collection[i].event_key.indexOf('worklog') !== -1 &&
            <ul className='list-unstyled clearfix' style={ { marginTop: '10px', marginBottom: '5px', fontSize: '12px' } }>
              { collection[i].data && collection[i].data.started_at       && <li style={ collection[i].event_key == 'del_worklog' ? ltStyles : {} }>开始时间: { moment.unix(collection[i].data.started_at).format('YY/MM/DD') }</li> }
              { collection[i].data && collection[i].data.spend            && <li style={ collection[i].event_key == 'del_worklog' ? ltStyles : {} }>耗时: { collection[i].data.spend }</li> }
              { collection[i].data && collection[i].data.leave_estimate   && <li style={ collection[i].event_key == 'del_worklog' ? ltStyles : {} }>剩余时间设置为: { collection[i].data.leave_estimate }</li> }
              { collection[i].data && collection[i].data.cut              && <li style={ collection[i].event_key == 'del_worklog' ? ltStyles : {} }>剩余时间缩减: { collection[i].data.cut }</li> }
              { collection[i].data && collection[i].data.comments         && <li style={ collection[i].event_key == 'del_worklog' ? ltStyles : { overflow: 'hidden', textOverflow: 'ellipsis' } } dangerouslySetInnerHTML={ { __html: '备注 : ' + collection[i].data.comments.replace(/(\r\n)|(\n)/g, '<br/>') } }/> }
            </ul> }
            {/* (collection[i].event_key == 'create_version' || collection[i].event_key == 'edit_version') &&
            <ul className='list-unstyled clearfix' style={ { marginTop: '10px', marginBottom: '5px', fontSize: '12px' } }>
              { collection[i].data && collection[i].data.start_time && <li>开始时间 : { moment.unix(collection[i].data.start_time).format('YY/MM/DD') }</li> }
              { collection[i].data && collection[i].data.end_time && <li>结束时间 : { moment.unix(collection[i].data.end_time).format('YY/MM/DD') }</li> }
              { collection[i].data && collection[i].data.description && <li>描述 : { collection[i].data.description }</li> }
            </ul> */}
          </div>
        ),
        time: agoName 
      });
    }

    const opts = {};
    if (indexLoading) {
      opts.noDataText = ( <div><img src={ img } className='loading'/></div> );
    } else {
      opts.noDataText = '暂无数据显示。'; 
    } 

    return (
      <div style={ { marginTop: '15px', marginBottom: '20px' } }>
        <Nav bsStyle='pills' style={ { float: 'left', lineHeight: '1.0' } } activeKey={ this.state.category } onSelect={ this.handleSelect.bind(this) }>
          <NavItem eventKey='all' href='#'>全部</NavItem>
          <NavItem eventKey='comments' href='#'>备注</NavItem>
          <NavItem eventKey='worklog' href='#'>工作日志</NavItem>
        </Nav>
        <Button style={ { float: 'right' } } onClick={ this.refresh.bind(this) }><i className='fa fa-refresh'></i>&nbsp;刷新</Button>
        <BootstrapTable data={ activities } bordered={ false } hover options={ opts } trClassName='tr-middle'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='avatar' width='40'/>
          <TableHeaderColumn dataField='summary'/>
          <TableHeaderColumn dataField='time' width='100'/>
        </BootstrapTable>
        { increaseCollection.length > 0 && increaseCollection.length % this.state.limit === 0 && 
        <ButtonGroup vertical block>
          <Button onClick={ this.more.bind(this) }>{ <div><img src={ img } className={ moreLoading ? 'loading' : 'hide' }/><span>{ moreLoading ? '' : '更多...' }</span></div> }</Button>
        </ButtonGroup> }
        { this.state.barShow &&
          <DetailBar
            i18n={ i18n }
            edit={ edit }
            create={ create }
            del={ del }
            setAssignee={ setAssignee }
            close={ this.closeDetail.bind(this) }
            options={ options }
            data={ itemData }
            record={ record }
            forward={ forward }
            visitedIndex={ visitedIndex }
            visitedCollection={ visitedCollection }
            issueCollection={ [] }
            show = { show }
            itemLoading={ itemLoading }
            loading={ loading }
            fileLoading={ fileLoading }
            project={ project }
            delFile={ delFile }
            addFile={ addFile }
            wfCollection={ wfCollection }
            wfLoading={ wfLoading }
            viewWorkflow={ viewWorkflow }
            indexComments={ indexComments }
            commentsCollection={ commentsCollection }
            commentsIndexLoading={ commentsIndexLoading }
            commentsLoading={ commentsLoading }
            commentsItemLoading={ commentsItemLoading }
            commentsLoaded={ commentsLoaded }
            addComments={ addComments }
            editComments={ editComments }
            delComments={ delComments }
            indexWorklog={ indexWorklog }
            worklogCollection={ worklogCollection }
            worklogIndexLoading={ worklogIndexLoading }
            worklogLoading={ worklogLoading }
            worklogLoaded={ worklogLoaded }
            addWorklog={ addWorklog }
            editWorklog={ editWorklog }
            delWorklog={ delWorklog }
            indexHistory={ indexHistory }
            historyCollection={ historyCollection }
            historyIndexLoading={ historyIndexLoading }
            historyLoaded={ historyLoaded }
            linkLoading={ linkLoading }
            createLink={ createLink }
            delLink={ delLink }
            watch={ watch }
            copy={ copy }
            move={ move }
            convert={ convert }
            resetState={ resetState }
            doAction={ doAction }
            user={ user }/> }
      </div>
    );
  }
}
