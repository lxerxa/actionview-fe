import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Form, FormControl, FormGroup, ControlLabel, Col, Panel } from 'react-bootstrap';
import _ from 'lodash';

const img = require('../../../assets/images/loading.gif');
const moment = require('moment');

export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
  }

  static propTypes = {
    issue_id: PropTypes.string.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    indexHistory: PropTypes.func.isRequired,
    collection: PropTypes.array.isRequired
  }

  render() {
    const { issue_id, indexHistory, collection, indexLoading } = this.props;

    return (
      <Form horizontal>
        <FormGroup>
          <Col sm={ 12 } className={ indexLoading && 'hide' } style={ { marginTop: '10px', marginBottom: '10px' } }>
            <div>
              <span className='comments-button' style={ { marginRight: '10px', float: 'right' } } onClick={ () => { indexHistory(issue_id) } }><i className='fa fa-refresh'></i> 刷新</span>
            </div>
          </Col>
          <Col sm={ 12 }>
          { indexLoading && <div style={ { width: '100%', textAlign: 'center', marginTop: '15px' } }><img src={ img } className='loading' /></div> }
          { collection.length <= 0 && !indexLoading ?
            <div style={ { width: '100%', textAlign: 'left', marginTop: '10px', marginLeft: '10px' } }>暂无改动纪录。</div>
            :
            _.map(collection, (val, i) => {
              const header = ( <div style={ { fontSize: '12px' } }>
                <span dangerouslySetInnerHTML= { { __html: '<a title="' + (val.operator && (val.operator.name + '(' + val.operator.email + ')')) + '">' + (val.operator && val.operator.name || '') + '</a> ' + (val.operation == 'modify' ? '修改': '新建') + ' - ' + (val.operated_at && moment.unix(val.operated_at).format('YY/MM/DD HH:mm:ss')) } } />
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
                        <td>{ v.field || '' }</td>
                        <td dangerouslySetInnerHTML = { { __html: _.isString(v.before_value) ? v.before_value.replace(/(\r\n)|(\n)/g, '<br/>') : (v.before_value || '') } }/>
                        <td dangerouslySetInnerHTML = { { __html: _.isString(v.after_value) ? v.after_value.replace(/(\r\n)|(\n)/g, '<br/>') : (v.after_value || '') } }/>
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
