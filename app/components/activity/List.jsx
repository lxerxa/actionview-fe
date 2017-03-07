import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, DropdownButton, MenuItem, ButtonGroup, Nav, NavItem } from 'react-bootstrap';
import Person from '../share/Person';
import _ from 'lodash';

const moment = require('moment');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { limit: 30, category: 'all', operateShow: false, hoverRowId: '' };
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    increaseCollection: PropTypes.array.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    moreLoading: PropTypes.bool.isRequired,
    more: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index({ limit: this.state.limit });
  }

  more() {
    const { more, collection } = this.props;
    more({ category: this.state.category, offset_id: collection[collection.length - 1].issue_id, limit: this.state.limit });
  }

  handleSelect(selectedKey) {
    this.setState({ category: selectedKey });

    const { index } = this.props;
    index({ category: selectedKey, limit: this.state.limit });
  }

  render() {
    const { collection, increaseCollection, indexLoading, moreLoading } = this.props;
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

    const activities = [];
    const activityNum = collection.length;
    for (let i = 0; i < activityNum; i++) {

      const user = <Person data={ collection[i].user } />;

      const normalEventFlag = collection[i].event_key.indexOf('create') === -1 && collection[i].event_key.indexOf('add') == -1 && collection[i].event_key.indexOf('edit') === -1 && collection[i].event_key.indexOf('del') === -1;

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
        summary: (
          <div>
            <span style={ { marginRight: '5px' } }>{ user }</span>
            { collection[i].event_key == 'create_issue' && <span>创建了</span> }
            { collection[i].event_key == 'edit_issue' && <span>更新了</span> }
            { collection[i].event_key == 'resolve_issue' && <span>解决了</span> }
            { collection[i].event_key == 'close_issue' && <span>关闭了</span> }
            { normalEventFlag && <span>处理了</span> }
            { collection[i].issue && <span style={ { marginRight: '5px' } }>问题</span> }
            { collection[i].issue && <a href='#'><span style={ { marginRight: '5px' } }>{ collection[i].issue.title }</span></a> } 
            { normalEventFlag && 
            <span>
            { _.map(collection[i].data, (v) => {
              return (<span>{ ', ' + v.field + ' 更新为: ' + v.after_value }</span>);
            }) }
            </span> }
            { collection[i].event_key == 'edit_issue' && <span>字段</span> }
            { collection[i].event_key == 'add_file' && <span>上传了文档 { collection[i].data }</span> }
            { collection[i].event_key == 'del_file' && <span>删除了文档 { collection[i].data }</span> }
            { collection[i].event_key == 'add_comments' && <span>添加了备注</span> }
            { collection[i].event_key == 'edit_comments' && <span>编辑了备注</span> }
            { collection[i].event_key == 'del_comments' && <span>删除了备注</span> }
            { collection[i].event_key == 'add_worklog' && <span>添加了工作日志</span> }
            { collection[i].event_key == 'edit_worklog' && <span>编辑了工作日志</span> }
            { collection[i].event_key == 'del_worklog' && <span>删除了工作日志</span> }
            { comments &&
            <ul className='list-unstyled clearfix' style={ { marginTop: '10px', marginBottom: '5px', fontSize: '12px' } }>
              <li dangerouslySetInnerHTML={ { __html: comments } }/>
            </ul> }
            { collection[i].event_key == 'edit_issue' &&
            <ul className='list-unstyled clearfix' style={ { marginTop: '10px', marginBottom: '5px', fontSize: '12px' } }>
            { _.map(collection[i].data, (v) => {
              return (<li dangerouslySetInnerHTML={ { __html: v.field + ': ' + v.after_value.replace(/(\r\n)|(\n)/g, '<br/>') } }/>);
            }) }
            </ul> }
            { (collection[i].event_key == 'add_worklog' || collection[i].event_key == 'edit_worklog' || collection[i].event_key == 'del_worklog') &&
            <ul className='list-unstyled clearfix' style={ { marginTop: '10px', marginBottom: '5px', fontSize: '12px' } }>
              { collection[i].data && collection[i].data.started_at && <li>开始时间: { moment.unix(collection[i].data.started_at).format('YY/MM/DD') }</li> }
              { collection[i].data && collection[i].data.spend && <li>耗时: { collection[i].data.spend }</li> }
              { collection[i].data && collection[i].data.leave_estimate && <li>剩余时间设置为: { collection[i].data.leave_estimate }</li> }
              { collection[i].data && collection[i].data.cut && <li>剩余时间缩减: { collection[i].data.cut }</li> }
              { collection[i].data && collection[i].data.comments && <li dangerouslySetInnerHTML={ { __html: '备注 : ' + collection[i].data.comments.replace(/(\r\n)|(\n)/g, '<br/>') } }/> }
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
      <div style={ { marginTop: '15px', marginBottom: '20px', lineHeight: '1.0' } }>
        <Nav bsStyle='pills' activeKey={ this.state.category } onSelect={ this.handleSelect.bind(this) }>
          <NavItem eventKey='all' href='#'>全部</NavItem>
          <NavItem eventKey='comments' href='#'>备注</NavItem>
          <NavItem eventKey='worklog' href='#'>工作日志</NavItem>
        </Nav>
        <BootstrapTable data={ activities } bordered={ false } hover options={ opts } trClassName='tr-middle'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='summary'/>
          <TableHeaderColumn dataField='time' width='100'/>
        </BootstrapTable>
        { increaseCollection.length > 0 && increaseCollection.length % this.state.limit === 0 && 
        <ButtonGroup vertical block>
          <Button onClick={ this.more.bind(this) }>{ <div><img src={ img } className={ moreLoading ? 'loading' : 'hide' }/><span>{ moreLoading ? '' : '更多...' }</span></div> }</Button>
        </ButtonGroup> }
      </div>
    );
  }
}
