import React, { PropTypes, Component } from 'react';
import { Modal, Button, Form, Col, FormGroup, ControlLabel } from 'react-bootstrap';
import _ from 'lodash';

const moment = require('moment');

export default class DetailModal extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  handleCancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { data } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>版本详情</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { maxHeight: '580px', overflow: 'auto' } }>
          <Form horizontal>
            <FormGroup>
              <Col sm={ 3 } componentClass={ ControlLabel }>
                名称 
              </Col>
              <Col sm={ 9 }>
                <div style={ { marginTop: '7px' } }>
                  { data.name || '-' }
                </div>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={ 3 } componentClass={ ControlLabel }>
                计划开始时间 
              </Col>
              <Col sm={ 9 }>
                <div style={ { marginTop: '7px' } }>
                  { data.start_time ? moment.unix(data.start_time).format('YYYY/MM/DD') : '-' }
                </div>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={ 3 } componentClass={ ControlLabel }>
                计划完成时间
              </Col>
              <Col sm={ 9 }>
                <div style={ { marginTop: '7px' } }>
                  { data.end_time ? moment.unix(data.end_time).format('YYYY/MM/DD') : '-' }
                </div>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={ 3 } componentClass={ ControlLabel }>
                发布时间
              </Col>
              <Col sm={ 9 }>
                <div style={ { marginTop: '7px' } }>
                  { data.released_time ? moment.unix(data.released_time).format('YYYY/MM/DD') : '-' }
                </div>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={ 3 } componentClass={ ControlLabel }>
                状态 
              </Col>
              <Col sm={ 9 }>
                <div style={ { marginTop: '7px' } }>
                  { data.status === 'released' ? '已发布' : '未发布' }
                </div>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={ 3 } componentClass={ ControlLabel }>
                描述
              </Col>
              <Col sm={ 9 }>
                <div style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word', marginTop: '7px' } } dangerouslySetInnerHTML={ {  __html: _.escape(data.description || '-').replace(/(\r\n)|(\n)/g, '<br/>') } }/>
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.handleCancel }>关闭</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
