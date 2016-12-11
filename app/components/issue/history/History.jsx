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
    indexLoading: PropTypes.bool.isRequired,
    indexHistory: PropTypes.func.isRequired,
    collection: PropTypes.array.isRequired
  }

  render() {
    const { indexHistory, collection, indexLoading } = this.props;

    return (
      <Form horizontal>
        <FormGroup>
          <Col sm={ 12 } className={ indexLoading && 'hide' } style={ { marginTop: '10px', marginBottom: '10px' } }>
            <div>
              <span className='comments-button' style={ { marginRight: '10px', float: 'right' } } onClick={ () => { indexHistory() } }><i className='fa fa-refresh'></i> 刷新</span>
            </div>
          </Col>
          <Col sm={ 12 }>
          { indexLoading && <div style={ { width: '100%', textAlign: 'center', marginTop: '15px' } }><img src={ img } className='loading' /></div> }
          { collection.length <= 0 && !indexLoading ?
            <div style={ { width: '100%', textAlign: 'left', marginTop: '10px', marginLeft: '10px' } }>暂无改动纪录。</div>
            :
            _.map(collection, (val, i) => {
              const header = ( <div style={ { fontSize: '12px' } }>
                <span dangerouslySetInnerHTML= { { __html: '<a title="' + (val.operator && val.operator.nameAndEmail || '') + '">' + (val.operator && val.operator.name || '') + '</a> 修改 - ' + (val.operated_at && moment.unix(val.operated_at).format('YY/MM/DD HH:mm')) } } />
              </div> ); 

              return (
                <Panel header={ header } key={ i } style={ { margin: '5px' } }>
                  <Table condensed hover responsive>
                    <thead>
                      <th>字段</th>
                      <th>原值</th>
                      <th>新值</th>
                    </thead>
                    <tbody>
                    { _.map(val.items || [], (v) => 
                        <tr>
                          <td>{ v.field || '' }</td>
                          <td>{ v.before || '' }</td>
                          <td>{ v.after || '' }</td>
                        </tr> ) }
                    </tbody>
                  </Table>
                </Panel>) } ) }
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
