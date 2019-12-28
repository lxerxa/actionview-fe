import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Form, FormControl, FormGroup, ControlLabel, Col, Panel, Checkbox } from 'react-bootstrap';
import _ from 'lodash';
import { getAgoAt } from '../../share/Funcs';

const img = require('../../../assets/images/loading.gif');
const moment = require('moment');

export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.state.displayTimeFormat = window.localStorage && window.localStorage.getItem('history-displayTimeFormat') || 'relative';
  }

  static propTypes = {
    issue_id: PropTypes.string,
    currentTime: PropTypes.number.isRequired,
    currentUser: PropTypes.object.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    indexHistory: PropTypes.func.isRequired,
    sortHistory: PropTypes.func.isRequired,
    collection: PropTypes.array.isRequired
  }

  swapTime() {
    if (this.state.displayTimeFormat == 'relative') {
      if (window.localStorage) {
        window.localStorage.setItem('history-displayTimeFormat', 'absolute');
      }
      this.setState({ displayTimeFormat: 'absolute' });
    } else {
      if (window.localStorage) {
        window.localStorage.setItem('history-displayTimeFormat', 'relative');
      }
      this.setState({ displayTimeFormat: 'relative' });
    }
  }

  render() {
    const { issue_id, currentTime, currentUser, indexHistory, sortHistory, collection, indexLoading } = this.props;

    return (
      <Form horizontal>
        <FormGroup>
          <Col sm={ 12 } className={ indexLoading && 'hide' } style={ { marginTop: '15px', marginBottom: '10px' } }>
            <div>
              <span className='comments-button' title='刷新' style={ { marginRight: '10px', float: 'right' } } onClick={ () => { indexHistory(issue_id, this.state.sort) } }><i className='fa fa-refresh'></i> 刷新</span>
              <span className='comments-button' title='排序' style={ { marginRight: '10px', float: 'right' } } onClick={ () => { sortHistory() } }><i className='fa fa-sort'></i> 排序</span>
              <span style={ { marginRight: '20px', float: 'right' } }>
                <Checkbox
                  style={ { paddingTop: '0px', minHeight: '18px' } }
                  checked={ this.state.displayTimeFormat == 'absolute' ? true : false }
                  disabled={ indexLoading }
                  onClick={ this.swapTime.bind(this) }>
                  显示绝对时间
                </Checkbox>
              </span>
            </div>
          </Col>
          <Col sm={ 12 }>
          { indexLoading && <div style={ { width: '100%', textAlign: 'center', marginTop: '15px' } }><img src={ img } className='loading' /></div> }
          { collection.length <= 0 && !indexLoading ?
            <div style={ { width: '100%', textAlign: 'left', marginTop: '10px', marginLeft: '10px' } }>暂无改动纪录。</div>
            :
            _.map(collection, (val, i) => {
              const header = ( <div style={ { fontSize: '12px' } }>
                <span dangerouslySetInnerHTML= { { __html: '<a title="' + (val.operator && (val.operator.name + '(' + val.operator.email + ')')) + '">' + (val.operator && val.operator.id === currentUser.id ? '我' : val.operator.name) + '</a> ' + (val.operation == 'modify' ? '修改': '新建') + ' - ' + (this.state.displayTimeFormat == 'absolute' ? moment.unix(val.operated_at).format('YYYY/MM/DD HH:mm:ss') : getAgoAt(val.operated_at, currentTime)) } } />
              </div> ); 

              return (
                <Panel header={ header } key={ i } style={ { margin: '5px' } }>
                  { val.operation == 'modify' ?
                  <Table condensed hover responsive>
                    <thead>
                      <tr>
                        <th>字段</th>
                        <th>原值</th>
                        <th>新值</th>
                      </tr>
                    </thead>
                    <tbody>
                    { _.map(val.data || [], (v) => 
                      <tr>
                        <td>
                          <div style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word', width: '120px' } }>
                            { v.field || '' }
                          </div>
                        </td>
                        <td> 
                          <div 
                            style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word', width: '190px' } } 
                            dangerouslySetInnerHTML = { { __html: _.isString(v.before_value) ? _.escape(v.before_value).replace(/(\r\n)|(\n)/g, '<br/>') : v.before_value } }/>
                        </td>
                        <td> 
                          <div 
                            style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word', width: '190px' } } 
                            dangerouslySetInnerHTML = { { __html: _.isString(v.after_value) ? _.escape(v.after_value).replace(/(\r\n)|(\n)/g, '<br/>') : v.after_value } }/>
                        </td>
                      </tr> ) }
                    </tbody>
                  </Table>
                  :
                  <span style={ { marginLeft: '5px' } }>创建问题</span> }
                </Panel>) } ) }
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
