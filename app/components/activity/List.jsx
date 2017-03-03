import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, DropdownButton, MenuItem } from 'react-bootstrap';
import Person from '../share/Person';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { operateShow: false, hoverRowId: '' };
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  render() {
    const { collection, indexLoading } = this.props;
    const { hoverRowId } = this.state;

    const titleStyles = { marginLeft: '5px', fontWeight: 600 };

    const activities = [];
    const activityNum = collection.length;
    for (let i = 0; i < activityNum; i++) {
      const cur_activity = collection[i];

      let title = '';
      const user = <Person data={ cur_activity.user } />;

      if (cur_activity.event_key == 'add_file') {
        title += ' 在问题 ' + (cur_activity.issue && cur_activity.issue.name || '');
        title += ' 上传了文档 ' + (cur_activity.data || '');
      } else if (cur_activity.event_key == 'del_file') {
        title += ' 删除了问题 ' + (cur_activity.issue && cur_activity.issue.name || '');
        title += ' 中的文档 ' + (cur_activity.data || '');
      } else if (cur_activity.event_key == 'create_issue') {
        title += ' 创建了问题 '; 
        title += (cur_activity.issue && cur_activity.issue.name || '');
      } else if (cur_activity.event_key == 'edit_issue') {
        title += ' 编辑了问题 '; 
        title += (cur_activity.issue && cur_activity.issue.name || '');
      }

      activities.push({
        id: collection[i].id,
        summary: (
          <div>
            <span>{ user }</span>
            { collection[i].event_key == 'create_issue' && <span style={ titleStyles }>创建了</span> }
            { collection[i].event_key == 'edit_issue' && <span style={ titleStyles }>更新了</span> }
            { collection[i].issue && <span style={ titleStyles }>问题</span> }
            { collection[i].issue && <span style={ titleStyles }>{ cur_activity.issue.name }</span> } 
            { collection[i].event_key == 'add_file' && <span style={ titleStyles }>上传了文档 { collection[i].data }</span> }
            { collection[i].event_key == 'del_file' && <span style={ titleStyles }>删除了文档 { collection[i].data }</span> }
            <ul className='list-unstyled clearfix' style={ { marginTop: '5px', marginBottom: '5px' } }>
              <li>{ title }</li>
              <li>{ title }</li>
            </ul>
          </div>
        ),
        time: '3天前'
      });
    }

    const opts = {};
    if (indexLoading) {
      opts.noDataText = ( <div><img src={ img } className='loading'/></div> );
    } else {
      opts.noDataText = '暂无数据显示。'; 
    } 

    return (
      <div>
        <BootstrapTable data={ activities } bordered={ false } hover options={ opts } trClassName='tr-middle'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='summary'/>
          <TableHeaderColumn dataField='time' width='100'/>
        </BootstrapTable>
      </div>
    );
  }
}
